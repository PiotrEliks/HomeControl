import { getDeviceSocket, getValveState, sendCommandToDevice } from '../lib/socket.js';
import { setValveCronSchedule, saveScheduleToDB, deleteCronTask } from '../lib/cronTasks.js';
import Schedule from '../models/schedule.model.js';
import ValveSession from '../models/valveSession.model.js';
import { Op, fn, col, literal } from 'sequelize';

export const turnValveOn = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { fullName } = req.body;
    const socket = getDeviceSocket(deviceId);
    console.log(deviceId);
    if (!socket) return res.status(404).json({ error: "Urządzenie niepodłączone" });

    const response = new Promise((resolve, reject) => {
      socket.once("updateState", data => resolve(data.state));
      setTimeout(() => reject(new Error("Timeout")), 5000);
    });
    socket.emit("command", { command: "on" });
    const newState = await response;
    console.log("NEW STATE ON",newState)
    await ValveSession.create({
      deviceId,
      openAt:    new Date(),
      openedBy:  fullName,
      method:    'manual',
      deviceId
    });

    res.json({ message: "Zawór otworzony", valve: { state: newState } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Błąd włączania" });
  }
};

export const turnValveOff = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { fullName } = req.body;
    const socket = getDeviceSocket(deviceId);
    if (!socket) return res.status(404).json({ error: "Urządzenie niepodłączone" });

    let totalFlow = 0.0;
    const response = new Promise((resolve, reject) => {
      socket.once("updateState", data => {
        totalFlow = data.extra?.waterFlow ?? null;
        resolve(data.state);
      });
      setTimeout(() => reject(new Error("Timeout")), 5000);
    });
    socket.emit("command", { command: "off" });
    const newState = await response;
    console.log("NEW STATE OFF",newState)

    const session = await ValveSession.findOne({
      where: { deviceId, closeAt: null },
      order: [['openAt','DESC']]
    });
    if (!session) {
      return res.status(400).json({ error: "Brak aktywnej sesji" });
    }

    const closeAt = new Date();
    const duration = Math.floor((closeAt - session.openAt) / 1000);
    await session.update({
      closeAt,
      duration,
      closedBy: fullName,
      waterFlow: totalFlow
    });

    res.json({ message: "Zawór zamknięty", valve: { state: newState, extra: { waterFlow: totalFlow} } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Błąd wyłączania" });
  }
};

export const getValveStateController = (req, res) => {
  const { deviceId } = req.params;
  const valve = getValveState(deviceId);
  console.log("GET VALVE STATE",valve)
  res.json({ deviceId, valve });
};

export const createValveSchedule = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { days, openHour, openMinute, closeHour, closeMinute, createdBy } = req.body;
    const daysString = days.join(',');
    const ts = Date.now();
    const openId  = `open-${deviceId}-${ts}`;
    const closeId = `close-${deviceId}-${ts}`;
    const openExpr  = `${openMinute} ${openHour} * * ${daysString}`;
    const closeExpr = `${closeMinute} ${closeHour} * * ${daysString}`;

    setValveCronSchedule(deviceId, openExpr,  openId,  'open',  createdBy);
    setValveCronSchedule(deviceId, closeExpr, closeId, 'close', createdBy);

    await saveScheduleToDB({
      deviceId,
      days, openHour, openMinute, closeHour, closeMinute,
      openCronExpression: openExpr,
      openCronJobId: openId,
      closeCronExpression: closeExpr,
      closeCronJobId: closeId,
      createdBy
    });

    const schedules = await Schedule.findAll({ where: { deviceId } });
    res.status(201).json(schedules);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Błąd tworzenia harmonogramu" });
  }
};

export const getValveSchedules = async (req, res) => {
  const { deviceId } = req.params;
  const schedules = await Schedule.findAll({ where: { deviceId } });
  res.json(schedules);
};

export const deleteValveSchedule = async (req, res) => {
  const { deviceId, openCronJobId } = req.params;
  deleteCronTask(openCronJobId);
  await Schedule.destroy({ where: { deviceId, openCronJobId } });
  const schedules = await Schedule.findAll({ where: { deviceId } });
  res.json(schedules);
};

export const getValveSessions = async (req, res) => {
  const { deviceId } = req.params;
  const {
    openDate, closeDate, openedBy, closedBy, method,
    sortBy, sortOrder, page = 1, limit = 20
  } = req.query;

  const where = { deviceId };
  if (openedBy) where.openedBy = openedBy;
  if (closedBy) where.closedBy = closedBy;
  if (method)   where.method   = method;
  if (openDate)  where.openAt  = {
    [Op.between]: [new Date(`${openDate}T00:00:00`), new Date(`${openDate}T23:59:59.999`)]
  };
  if (closeDate) where.closeAt = {
    [Op.between]: [new Date(`${closeDate}T00:00:00`), new Date(`${closeDate}T23:59:59.999`)]
  };

  const valid = ['openAt','closeAt','duration','waterFlow'];
  const order = valid.includes(sortBy)
    ? [[sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']]
    : [['openAt','DESC']];

  const offset = (Math.max(1, +page) - 1) * Math.max(1, +limit);
  const { count: total, rows: sessions } = await ValveSession.findAndCountAll({
    where, order, limit: +limit, offset
  });
  res.json({
    sessions,
    meta: {
      total,
      page: +page,
      perPage: +limit,
      totalPages: Math.ceil(total / limit)
    }
  });
};

export const getValveStats = async (req, res) => {
  const { deviceId } = req.params;
  const { startDate, endDate, openedBy, method, metric='flow', groupBy='day' } = req.query;
  const where = { deviceId };
  if (startDate && endDate) {
    where.openAt = {
      [Op.between]: [
        new Date(`${startDate}T00:00:00.000Z`),
        new Date(`${endDate}T23:59:59.999Z`)
      ]
    };
  }
  if (openedBy) where.openedBy = openedBy;
  if (method)   where.method   = method;

  const attributes = [], group = [];
  if (groupBy==='day') {
    attributes.push([fn('DATE', col('openAt')), 'date']);
    group.push(literal('DATE("openAt")'));
  }
  if (groupBy==='user')   { attributes.push('openedBy'); group.push('openedBy'); }
  if (groupBy==='method') { attributes.push('method');   group.push('method');   }
  if (groupBy==='schedule'){ attributes.push('scheduleId'); group.push('scheduleId'); }

  if (metric==='flow') {
    attributes.push([fn('SUM', col('waterFlow')), 'totalFlow']);
  } else {
    attributes.push([fn('SUM', col('duration')), 'totalDuration']);
  }

  const data = await ValveSession.findAll({
    where,
    attributes,
    group,
    order: groupBy==='day' ? [[literal('DATE("openAt")'),'ASC']] : undefined
  });

  res.json({ data });
};
