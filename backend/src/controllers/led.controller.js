import { getDeviceSocket, getLedState } from '../lib/socket.js';
import { setLedCronSchedule, saveScheduleToDB, deleteCronTask } from '../lib/cronTasks.js';
import Schedule from '../models/schedule.model.js';

export const turnLedOn = async (req, res) => {
    try {
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
            deviceSocket.emit("command", { command: "on" });
            const newState = await new Promise((resolve, reject) => {
                deviceSocket.once("update", (data) => {
                  resolve(data.state);
                });
                setTimeout(() => {
                  reject(new Error("Timeout waiting for LED update"));
                }, 5000);
              });
            return res.status(200).json({ message: "Polecenie włączenia wysłane", led: newState });
        } else {
            return res.status(500).json({ error: "Urządzenie nie jest podłączone" });
        }
    } catch (error) {
        console.error("Error turning LED on:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas włączania LED" });
    }
};

export const turnLedOff = async (req, res) => {
    try {
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
          deviceSocket.emit("command", { command: "off" });
          const newState = await new Promise((resolve, reject) => {
            deviceSocket.once("update", (data) => {
              resolve(data.state);
            });
            setTimeout(() => {
              reject(new Error("Timeout waiting for LED update"));
            }, 5000);
          });
          return res.status(200).json({ message: "Polecenie wyłączenia wysłane", led: newState });
        } else {
          return res.status(500).json({ error: "Urządzenie nie jest podłączone" });
        }
    } catch (error) {
        console.error("Error turning LED off:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas wyłączania LED" });
    }
};

export const getLedStateController = (req, res) => {
    const ledState = getLedState();
    console.log(ledState);
    return res.status(200).json({ led: ledState });
};

export const createLedSchedule = async (req, res) => {
    try {
        const { days, hour, minute, createdBy, type } = req.body;
        if (!days || !hour || !minute || !type) {
            return res.status(400).json({ message: 'Brak wymaganych danych' });
        }

        const cronExpression = `${minute} ${hour} * * ${days.join(',')}`;
        const cronJobId = `job-${Date.now()}`;
        await saveScheduleToDB(days, hour, minute, cronExpression, cronJobId, type, createdBy);
        setLedCronSchedule(cronExpression, cronJobId, type);
        const schedules = await Schedule.findAll()
        return res.status(200).json(schedules);
    } catch (error) {
        console.error("Error creating schedule:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas ustawiania harmonogramu" });
    }
};

export const getLedSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        return res.status(200).json(schedules);
    } catch (error) {
        console.error('Błąd przy pobieraniu harmonogramów:', error);
        return res.status(500).json({ message: 'Błąd przy pobieraniu harmonogramów' });
    }
};

export const deleteLedSchedule = async (req, res) => {
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