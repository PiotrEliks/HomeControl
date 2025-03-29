import { getDeviceSocket, getLedState } from '../lib/socket.js';

export const turnLedOn = async (req, res) => {
    try {
        const deviceSocket = getDeviceSocket();
        if (deviceSocket) {
            deviceSocket.emit("command", { command: "on" });
            return res.status(200).json({ message: "Polecenie włączenia wysłane" });
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
          return res.status(200).json({ message: "Polecenie wyłączenia wysłane" });
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