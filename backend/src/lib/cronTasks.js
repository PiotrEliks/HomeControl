import cron from 'node-cron';
import Schedule from '../models/schedule.model.js';
import { getDeviceSocket } from './socket.js';

let cronTasks = {};

export const setLedCronSchedule = (cronExpression, cronJobId, type) => {
  if (cronTasks[cronJobId]) {
    console.log(`Zadanie o ID ${cronJobId} już istnieje`);
    return;
  }

  cronTasks[cronJobId] = cron.schedule(cronExpression, async () => {
    try {
       const deviceSocket = getDeviceSocket();
      if (deviceSocket) {
        if (type === 'open') {
          deviceSocket.emit("command", { command: "on" });
        }
        if (type === 'close') {
          deviceSocket.emit("command", { command: "off" });
        }
        const newState = await new Promise((resolve, reject) => {
          deviceSocket.once("update", (data) => {
            resolve(data.state);
          });
          setTimeout(() => {
            reject(new Error("Timeout waiting for LED update"));
          }, 5000);
        });
        console.log('LED task wykonany');
        return res.status(200).json({ message: "Polecenie wyłączenia wysłane", led: newState });
      } else {
        return res.status(500).json({ error: "Urządzenie nie jest podłączone" });
      }
      } catch (error) {
        return res.status(500).json({ message: "CronJob Failed" });
    }

  });

  console.log(`Harmonogram ustawiony na: ${cronExpression}`);
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

export const saveScheduleToDB = async (days, hour, minute, cronExpression, cronJobId, type, createdBy) => {
  try {
      const schedule = await Schedule.create({
          days,
          hour,
          minute,
          cronExpression,
          cronJobId,
          type,
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
      setLedCronSchedule(schedule.cronExpression, schedule.cronJobId, schedule.type);
    });
  } catch (error) {
      console.error('Błąd ładowania harmonogramów:', error);
  }
};