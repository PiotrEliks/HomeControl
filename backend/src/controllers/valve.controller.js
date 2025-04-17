import { getDeviceSocket, getValveState } from '../lib/socket.js';
import { setValveCronSchedule, saveScheduleToDB, deleteCronTask } from '../lib/cronTasks.js';
import Schedule from '../models/schedule.model.js';
import ValveSession from '../models/valveSession.mode.js';

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
          const newState = await new Promise((resolve, reject) => {
            deviceSocket.once("update", (data) => {
              resolve(data.state);
            });
            setTimeout(() => {
              reject(new Error("Timeout waiting for valve update"));
            }, 5000);
          });

        const openSession = await ValveSession.findOne({
            where: { closeAt: null },
            order: [['openAt', 'DESC']]
        });

        if (openSession) {
            const closeAt = new Date();
            const duration = Math.floor((closeAt - openSession.openAt) / 1000);
            console.log(duration, openSession.openAt, openSession.openAt.getTime())
            await openSession.update({
                closeAt,
                duration,
                closedBy: fullName
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