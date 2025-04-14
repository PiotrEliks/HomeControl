import { getDeviceSocket, getValveState } from '../lib/socket.js';
import { setValveCronSchedule, saveScheduleToDB, deleteCronTask } from '../lib/cronTasks.js';
import Schedule from '../models/schedule.model.js';
import ValveLogs from '../models/valveLogs.model.js';

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

              const newLog = await ValveLogs.create({
                fullName,
                state: false,
              });

            return res.status(200).json({ message: "Polecenie włączenia wysłane", valve: newState });
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
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
          deviceSocket.emit("command", { command: "off" });
          const newState = await new Promise((resolve, reject) => {
            deviceSocket.once("update", (data) => {
              resolve(data.state);
            });
            setTimeout(() => {
              reject(new Error("Timeout waiting for valve update"));
            }, 5000);
          });

          const lastLog = await ValveLogs.findOne({
            order: [['createdAt', 'DESC']]
          });

          if (lastLog) {
              await lastLog.update({
                  state: true
              });
          } else {
              return res.status(500).json({ error: "Zawór już jest wyłączony" });
          }

          return res.status(200).json({ message: "Polecenie wyłączenia wysłane", valve: newState });
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
        const { days, hour, minute, createdBy, type } = req.body;
        if (!days || !hour || !minute || !type) {
            return res.status(400).json({ message: 'Brak wymaganych danych' });
        }

        const cronExpression = `${minute} ${hour} * * ${days.join(',')}`;
        const cronJobId = `job-${Date.now()}`;
        await saveScheduleToDB(days, hour, minute, cronExpression, cronJobId, type, createdBy);
        setValveCronSchedule(cronExpression, cronJobId, type);
        const schedules = await Schedule.findAll()
        return res.status(200).json(schedules);
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
        const { cronJobId } = req.params;
        if (!cronJobId) {
            return res.status(400).json({ message: 'Brak ID zadania' });
        }
        deleteCronTask(cronJobId);
        await Schedule.destroy({
            where: {
                cronJobId: cronJobId,
            }
        });

        const schedules = await Schedule.findAll()
        return res.status(200).json(schedules);
    } catch (error) {
        console.error('Błąd przy pobieraniu harmonogramów:', error);
        return res.status(500).json({ message: 'Błąd przy pobieraniu harmonogramów' });
    }
};