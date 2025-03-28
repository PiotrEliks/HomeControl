import { getDeviceSocket, getLedState } from '../lib/socket.js';

export const turnLedOn = async (req, res) => {
    try {
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
            deviceSocket.emit("command", { command: "on" });
            res.json({ message: "Polecenie włączenia wysłane" });
        } else {
            res.status(500).json({ error: "Urządzenie nie jest podłączone" });
        }
    } catch (error) {
        console.error("Error turning LED on:", error);
        res.status(500).json({ error: "Wystąpił błąd podczas włączania LED" });
    }
};

export const turnLedOff = async (req, res) => {
    try {
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
          deviceSocket.emit("command", { command: "off" });
          res.json({ message: "Polecenie wyłączenia wysłane" });
        } else {
          res.status(500).json({ error: "Urządzenie nie jest podłączone" });
        }
    } catch (error) {
        console.error("Error turning LED off:", error);
        res.status(500).json({ error: "Wystąpił błąd podczas wyłączania LED" });
    }
};

export const getLedStateController = (req, res) => {
    const ledState = getLedState();
    res.json({ led: ledState });
};