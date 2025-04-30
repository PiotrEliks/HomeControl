import { getDeviceSocket, getValveState } from '../lib/socket.js';
import { setValveCronSchedule, saveScheduleToDB, deleteCronTask } from '../lib/cronTasks.js';
import Schedule from '../models/schedule.model.js';
import ValveSession from '../models/valveSession.model.js';
import { Op, fn, col, literal } from 'sequelize';

export const turnValveOn = async (req, res) => {
    try {
        const { fullName } = req.body;
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
            deviceSocket.emit("command", { command: "on" });
            const newState = await new Promise((resolve, reject) => {
                deviceSocket.once("update", (data) => {
                  resolve(data.state);
                });
                setTimeout(() => {
                  reject(new Error("Timeout waiting for valve update"));
                }, 5000);
            });

            await ValveSession.create({
                openAt: new Date(),
                openedBy: fullName,
                method: 'manual'
            });

              return res.status(200).json({ message: "Polecenie otwarcia wysłane", valve: newState });
            } else {
              return res.status(500).json({ error: "Urządzenie nie jest podłączone" });
            }
    } catch (error) {
        console.error("Error turning valve on:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas włączania zaworu" });
    }
};

export const turnValveOff = async (req, res) => {
    try {
        const { fullName } = req.body;
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
          deviceSocket.emit("command", { command: "off" });
          let totalFlow;
          const newState = await new Promise((resolve, reject) => {
            deviceSocket.once("update", (data) => {
              console.log("XXXX", data)
              totalFlow = data.totalFlow;
              resolve(data.state);
            });
            setTimeout(() => {
              reject(new Error("Timeout waiting for valve update"));
            }, 5000);
          });
          console.log(totalFlow)

        const openSession = await ValveSession.findOne({
            where: { closeAt: null },
            order: [['openAt', 'DESC']]
        });

        if (openSession) {
            const closeAt = new Date();
            const openAt = openSession.openAt;
            const openUtcMs  = openAt.getTime()  - (openAt.getTimezoneOffset() * 60000);
            const closeUtcMs = closeAt.getTime() - (closeAt.getTimezoneOffset() * 60000);

            const duration = Math.floor((closeUtcMs - openUtcMs) / 1000);
            await openSession.update({
                closeAt,
                duration,
                closedBy: fullName,
                waterFlow: totalFlow
            });

            return res.status(200).json({ message: "Polecenie zamknięcia wysłane", valve: newState });
        } else {
            return res.status(400).json({ error: "Nie znaleziono aktywnej sesji otwarcia. Zawór prawdopodobnie już jest zamknięty." });
        }

        } else {
          return res.status(500).json({ error: "Urządzenie nie jest podłączone" });
        }
    } catch (error) {
        console.error("Error turning valve off:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas wyłączania zaworu" });
    }
};

export const getValveStateController = (req, res) => {
    const valveState = getValveState();
    console.log(valveState);
    return res.status(200).json({ valve: valveState });
};

export const createValveSchedule = async (req, res) => {
    try {
      const { days, openHour, openMinute, closeHour, closeMinute, createdBy } = req.body;
      if (!days || openHour === undefined || openMinute === undefined || closeHour === undefined || closeMinute === undefined) {
        return res.status(400).json({ message: 'Brak wymaganych danych' });
      }

      const daysString = days.join(',');

      const openCronExpression = `${openMinute} ${openHour} * * ${daysString}`;
      const closeCronExpression = `${closeMinute} ${closeHour} * * ${daysString}`;

      const timestamp = Date.now();
      const openCronJobId = `open-job-${timestamp}`;
      const closeCronJobId = `close-job-${timestamp}`;

      setValveCronSchedule(openCronExpression, openCronJobId, 'open', createdBy);
      setValveCronSchedule(closeCronExpression, closeCronJobId, 'close', createdBy);

      const scheduleData = {
        days,
        openHour,
        openMinute,
        closeHour,
        closeMinute,
        openCronExpression,
        openCronJobId,
        closeCronExpression,
        closeCronJobId,
        createdBy
      };

      await saveScheduleToDB(scheduleData);

      const schedules = await Schedule.findAll();
      return res.status(201).json(schedules);
    } catch (error) {
      console.error("Error creating schedule:", error);
      return res.status(500).json({ error: "Wystąpił błąd podczas ustawiania harmonogramu" });
    }
  };

export const getValveSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        return res.status(200).json(schedules);
    } catch (error) {
        console.error('Błąd przy pobieraniu harmonogramów:', error);
        return res.status(500).json({ message: 'Błąd przy pobieraniu harmonogramów' });
    }
};

export const deleteValveSchedule = async (req, res) => {
    try {
        const { openCronJobId } = req.params;
        if (!openCronJobId) {
            return res.status(400).json({ message: 'Brak ID zadania' });
        }
        deleteCronTask(openCronJobId);
        await Schedule.destroy({
            where: {
              openCronJobId: openCronJobId,
            }
        });

        const schedules = await Schedule.findAll()
        return res.status(200).json(schedules);
    } catch (error) {
        console.error('Błąd przy pobieraniu harmonogramów:', error);
        return res.status(500).json({ message: 'Błąd przy pobieraniu harmonogramów' });
    }
};

export const getValveSessions = async (req, res) => {
  try {
    const {
      openDate, closeDate, openedBy, closedBy, method,
      sortBy, sortOrder,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page, 10)  || 1);
    const perPage  = Math.max(1, parseInt(limit, 10) || 20);
    const offset   = (pageNum - 1) * perPage;

    const where = {};
    if (openedBy) where.openedBy = openedBy;
    if (closedBy) where.closedBy = closedBy;
    if (method)   where.method   = method;

    if (openDate) {
      const start = new Date(`${openDate}T00:00:00`);
      const end   = new Date(`${openDate}T23:59:59.999`);
      where.openAt = { [Op.between]: [ start, end ] };
    }
    if (closeDate) {
      const start = new Date(`${closeDate}T00:00:00`);
      const end   = new Date(`${closeDate}T23:59:59.999`);
      where.closeAt = { [Op.between]: [ start, end ] };
    }

    const validFields = ['openAt','closeAt','duration','waterFlow'];
    const order = [];
    if (sortBy && validFields.includes(sortBy)) {
      const dir = (sortOrder||'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      order.push([sortBy, dir]);
    } else {
      order.push(['openAt','DESC']);
    }

    const { count: total, rows: sessions } = await ValveSession.findAndCountAll({
      where,
      order,
      limit: perPage,
      offset
    });

    const totalPages = Math.ceil(total / perPage);

    return res.json({ sessions, meta: { total, page: pageNum, perPage, totalPages } });
  } catch (err) {
    console.error('Error fetching sessions:', err);
    return res.status(500).json({ error: 'Błąd podczas pobierania sesji zaworu' });
  }
};

export const getValveStats = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      openedBy,
      method,
      metric = 'flow',
      groupBy = 'day'
    } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.openAt = {
        [Op.between]: [
          new Date(`${startDate}T00:00:00.000Z`),
          new Date(`${endDate}T23:59:59.999Z`)
        ]
      };
    }
    if (openedBy)    where.openedBy = openedBy;
    if (method)      where.method   = method;

    let group       = [];
    let attributes  = [];

    if (groupBy === 'day') {
      attributes.push([fn('DATE', col('openAt')), 'date']);
      group.push(literal('DATE("openAt")'));
    }
    if (groupBy === 'user') {
      attributes.push('openedBy');
      group.push('openedBy');
    }
    if (groupBy === 'method') {
      attributes.push('method');
      group.push('method');
    }
    if (groupBy === 'schedule') {
      attributes.push('scheduleId');
      group.push('scheduleId');
    }

    if (metric === 'flow') {
      attributes.push([fn('SUM', col('waterFlow')), 'totalFlow']);
    } else {
      attributes.push([fn('SUM', col('duration')), 'totalDuration']);
    }

    const logs = await ValveSession.findAll({
      where,
      attributes,
      group,
      order: groupBy === 'day'
        ? [[literal('DATE("openAt")'), 'ASC']]
        : undefined
    });

    return res.json({ data: logs });
  } catch (error) {
    console.error('Error fetching valve logs:', error);
    return res.status(500).json({ error: 'Błąd podczas pobierania danych' });
  }
};