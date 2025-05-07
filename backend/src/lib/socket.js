import { Server as SocketIOServer } from "socket.io";

const deviceSockets = new Map();
const ioClients = new Set();
let io;

export function initSocket(server) {
  io = new SocketIOServer(server, { 
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true,
    },
    allowEIO3: true,
  });

  io.on("connection", socket => {
    console.log("🔌 Nowe połączenie socket.io:", socket.id);

    socket.on("register", data => {
      let payload = data;
      if (typeof data === "string") {
        try { payload = JSON.parse(data); }
        catch (e) { return console.error("🚨 Błąd JSON:", e); }
      }

      const { role, deviceId, deviceType } = payload;
      if (role === "device" && deviceId) {
        deviceSockets.set(deviceId, socket);
        socket.join(`device:${deviceId}`);
        socket.deviceId = deviceId;
        socket.deviceType = deviceType;
        console.log(`📟 Urządzenie [${deviceType}] ${deviceId} zarejestrowane`);

        socket.emit("registered", { success: true, deviceId });
      }
      else if (role === "frontend") {
        ioClients.add(socket);
        console.log(`💻 Frontend ${socket.id} zarejestrowany`);
        socket.emit("devices", Array.from(deviceSockets.keys()));
      }
    });

    socket.on("subscribe", ({ deviceId }) => {
      if (!socket.deviceId) {
        socket.join(`device:${deviceId}`);
        console.log(`👁️ Frontend ${socket.id} subskrybuje ${deviceId}`);
      }
    });

    socket.on("updateState", ({ deviceId, state, extra }) => {
      io.to(`device:${deviceId}`).emit("state", { deviceId, state, extra });
    });

    socket.on("command", ({ deviceId, command }) => {
      io.to(`device:${deviceId}`).emit("command", { command });
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket rozłączony:", socket.id);
      if (socket.deviceId) {
        deviceSockets.delete(socket.deviceId);
        io.to(`device:${socket.deviceId}`)
          .emit("state", { deviceId: socket.deviceId, disconnected: true });
      }
      ioClients.delete(socket);
    });
  });
}

export function sendCommandToDevice(deviceId, command) {
  if (!io) throw new Error("Socket.IO nie zainicjalizowane");
  io.to(`device:${deviceId}`).emit("command", { command });
}
