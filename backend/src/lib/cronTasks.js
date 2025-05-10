import cron from 'node-cron';
import Schedule from '../models/schedule.model.js';
import ValveSession from '../models/valveSession.model.js';
import { getDeviceSocket, getValveState } from './socket.js';

let cronTasks = {};

export const setValveCronSchedule = (deviceId, cronExpression, cronJobId, type, createdBy) => {
  if (cronTasks[cronJobId]) {
    console.log(`Zadanie o ID ${cronJobId} już istnieje dla urządzenia ${deviceId}`);
    return;
  }

  cronTasks[cronJobId] = cron.schedule(cronExpression, async () => {
    try {
      const socket = getDeviceSocket(deviceId);
      if (!socket) {
        console.error(`Urządzenie ${deviceId} nie jest podłączone`);
        return;
      }

      const current = getValveState(deviceId)?.state;

      if (type === 'open' && current === 'on') {
        console.log(`Cron [${cronJobId}]: zawór ${deviceId} jest już otwarty, najpierw zamykam`);
        socket.emit('command', { command: 'off' });
        let flowBefore;
        await new Promise((resolve, reject) => {
          socket.once('updateState', data => {
            flowBefore = data.extra?.waterFlow ?? null;
            resolve(data.state);
          });
          setTimeout(() => reject(new Error('Timeout zamykania przed otwarciem')), 5000);
        });
 
        const lastSession = await ValveSession.findOne({
          where: { deviceId, closeAt: null, method: 'schedule' },
          order: [['openAt', 'DESC']]
        });
        if (lastSession) {
          const closeAt = new Date();
          const duration = Math.floor((closeAt - lastSession.openAt) / 1000);
          await lastSession.update({ closeAt, duration, closedBy: createdBy, waterFlow: flowBefore });
        }
      }

      const command = type === 'open' ? 'on' : 'off';
      console.log(`Cron [${cronJobId}] wysyła komendę ${command} do ${deviceId}`);
      socket.emit('command', { command });

      let totalFlow = null;
      const newState = await new Promise((resolve, reject) => {
        socket.once('updateState', data => {
          if (command === 'off') totalFlow = data.extra?.waterFlow ?? null;
          resolve(data.state);
        });
        setTimeout(() => reject(new Error('Timeout waiting for update')), 5000);
      });
      console.log(`Cron [${cronJobId}] zakończony. Nowy stan: ${newState}`);

      if (type === 'open' && newState === 'on') {
        await ValveSession.create({ deviceId, openAt: new Date(), openedBy: createdBy, method: 'schedule' });
      }
      if (type === 'close' && newState === 'off') {
        const session = await ValveSession.findOne({
          where: { deviceId, closeAt: null, method: 'schedule' },
          order: [['openAt', 'DESC']]
        });
        if (session) {
          const closeAt = new Date();
          const duration = Math.floor((closeAt - session.openAt) / 1000);
          await session.update({ closeAt, duration, closedBy: createdBy, waterFlow: totalFlow });
        } else {
          console.log(`Brak aktywnej sesji schedule do zamknięcia dla urządzenia ${deviceId}`);
        }
      }
    } catch (error) {
      console.error(`CronJob [${cronJobId}] failed for device ${deviceId}:`, error);
    }
  });

  console.log(`Harmonogram ustawiony dla ${deviceId}: ${cronExpression} (typ: ${type}, ID: ${cronJobId})`);
};

export const deleteCronTask = (cronJobId) => {
  const task = cronTasks[cronJobId];
  if (task) {
    task.stop();
    delete cronTasks[cronJobId];
    console.log(`Zadanie ${cronJobId} usunięte`);
  } else {
    console.log(`Zadanie ${cronJobId} nie istnieje`);
  }
};

export const saveScheduleToDB = async (data) => {
  try {
    const schedule = await Schedule.create({
      deviceId:            data.deviceId,
      days:                data.days,
      openHour:            data.openHour,
      openMinute:          data.openMinute,
      closeHour:           data.closeHour,
      closeMinute:         data.closeMinute,
      openCronExpression:  data.openCronExpression,
      openCronJobId:       data.openCronJobId,
      closeCronExpression: data.closeCronExpression,
      closeCronJobId:      data.closeCronJobId,
      createdBy:           data.createdBy
    });
    console.log('Harmonogram zapisany w bazie danych');
    return schedule;
  } catch (error) {
    console.error('Błąd zapisu harmonogramu:', error);
    throw error;
  }
};

export const loadSchedulesFromDB = async () => {
  try {
    const schedules = await Schedule.findAll();
    schedules.forEach(s => {
      setValveCronSchedule(
        s.deviceId,
        s.openCronExpression,
        s.openCronJobId,
        'open',
        s.createdBy
      );
      setValveCronSchedule(
        s.deviceId,
        s.closeCronExpression,
        s.closeCronJobId,
        'close',
        s.createdBy
      );
    });
    console.log('Wszystkie harmonogramy załadowane z bazy');
  } catch (error) {
    console.error('Błąd ładowania harmonogramów:', error);
  }
};
