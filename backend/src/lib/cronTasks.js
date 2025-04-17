import cron from 'node-cron';
import Schedule from '../models/schedule.model.js';
import ValveSession from '../models/valveSession.mode.js';
import { getDeviceSocket, getValveState } from './socket.js';

let cronTasks = {};

export const setValveCronSchedule = (cronExpression, cronJobId, type, createdBy) => {
  if (cronTasks[cronJobId]) {
    console.log(`Zadanie o ID ${cronJobId} już istnieje`);
    return;
  }

  cronTasks[cronJobId] = cron.schedule(cronExpression, async () => {
    try {
      const currentState = getValveState();

      const deviceSocket = getDeviceSocket();
      if (deviceSocket) {
        if (currentState) {
          deviceSocket.emit("command", { command: "off" });
          await new Promise((resolve, reject) => {
            deviceSocket.once("update", (data) => {
              resolve(data.state);
            });
            setTimeout(() => {
              reject(new Error("Timeout waiting for valve update"));
            }, 5000);
          });
          const openSession = await ValveSession.findOne({
            where: {
              closeAt: null,
              method: 'manual'
            },
            order: [['openAt', 'DESC']]
          });
          if (openSession) {
            const closeAt = new Date();
            const duration = Math.floor((closeAt.getTime() - new Date(openSession.openAt).getTime()) / 1000);
            await openSession.update({
              closeAt,
              duration,
              closedBy: createdBy
            });
          }
        }

        const command = type === 'open' ? 'on' : 'off';

        deviceSocket.emit("command", { command: command });

        const newState = await new Promise((resolve, reject) => {
          deviceSocket.once("update", (data) => {
            resolve(data.state);
          });
          setTimeout(() => {
            reject(new Error("Timeout waiting for valve update"));
          }, 5000);
        });
        console.log(`Zadanie ${type} zaworu wykonane, nowy stan: ${newState}`);
        if (type === 'open') {
          await ValveSession.create({
            openAt: new Date(),
            openedBy: createdBy,
            method: 'schedule'
          });
        }
        if (type === 'close') {
          const openSession = await ValveSession.findOne({
            where: {
              closeAt: null,
              method: 'schedule'
            },
            order: [['openAt', 'DESC']]
          });
          if (openSession) {
            const openAt = openSession.openAt;
            const openUtcMs  = openAt.getTime()  - (openAt.getTimezoneOffset() * 60000);
            const closeUtcMs = closeAt.getTime() - (closeAt.getTimezoneOffset() * 60000);

            const duration = Math.floor((closeUtcMs - openUtcMs) / 1000);
            // const closeAt = new Date();
            // const duration = Math.floor((closeAt.getTime() - new Date(openSession.openAt).getTime()) / 1000);
            await openSession.update({
              closeAt,
              duration,
              closedBy: createdBy
            });
          } else {
            console.log("Nie znaleziono aktywnej sesji harmonogramu otwarcia – być może zawór został zamknięty manualnie.");
          }
        }

        return newState;
      } else {
        console.error("Urządzenie nie jest podłączone");
      }
    } catch (error) {
      console.error("CronJob Failed", error);
    }
  });

  console.log(`Harmonogram ustawiony: ${cronExpression} (typ: ${type})`);
};

export const deleteCronTask = (cronJobId) => {
  if (cronTasks[cronJobId]) {
      cronTasks[cronJobId].stop();
      delete cronTasks[cronJobId];
      console.log(`Zadanie o ID ${cronJobId} zostało usunięte`);
  } else {
      console.log(`Zadanie o ID ${cronJobId} nie istnieje`);
  }
};

export const saveScheduleToDB = async (data) => {
  const { days, openHour, openMinute, closeHour, closeMinute, openCronExpression, openCronJobId, closeCronExpression, closeCronJobId, createdBy } = data;
  try {
      const schedule = await Schedule.create({
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
      });
      console.log('Harmonogram zapisany w bazie danych');
      return schedule;
  } catch (error) {
      console.error('Błąd zapisywania harmonogramu:', error);
  }
};

export const loadSchedulesFromDB = async () => {
  try {
    const schedules = await Schedule.findAll();
    schedules.forEach(schedule => {
      setValveCronSchedule(schedule.openCronExpression, schedule.openCronJobId, 'open', schedule.createdBy);
      setValveCronSchedule(schedule.closeCronExpression, schedule.closeCronJobId, 'close', schedule.createdBy);
    });
  } catch (error) {
      console.error('Błąd ładowania harmonogramów:', error);
  }
};