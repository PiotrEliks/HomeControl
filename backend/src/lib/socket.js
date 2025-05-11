import { Server as SocketIOServer } from "socket.io";

const deviceSockets = new Map();
const deviceStates  = new Map();
const ioClients     = new Set();
let io;

export function initSocket(server) {
  io = new SocketIOServer(server, {
    cors: { origin: "*", methods: ["GET","POST"], transports: ["websocket","polling"], credentials: true },
    allowEIO3: true,
  });

  io.on("connection", socket => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("register", raw => {
      const { role, deviceId, deviceType } = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (role === "device" && deviceId) {
        deviceSockets.set(deviceId, socket);
        socket.deviceId   = deviceId;
        socket.deviceType = deviceType;
        socket.join(`device:${deviceId}`);
        console.log(`📟 Device ${deviceType}[${deviceId}] registered`);

        socket.emit("registered", { success: true, deviceId });
      }
      else if (role === "frontend") {
        ioClients.add(socket);
        console.log(`📱 Frontend client connected`);
        socket.emit("devices", Array.from(deviceSockets.keys()));
      }
    });

    socket.on("updateState", ({ state, extra }) => {
      if (!socket.deviceId) return;
      console.log(`📡 Device ${socket.deviceType}[${socket.deviceId}] state:`, state, extra);
      deviceStates.set(socket.deviceId, { state, extra });
      console.log("Device states:", deviceStates);
      ioClients.forEach(c => c.emit("state", { deviceId: socket.deviceId, state, extra }));
    });

    socket.on("disconnect", () => {
      if (socket.deviceId) {
        console.log(`❌ Device ${socket.deviceType}[${socket.deviceId}] disconnected`);
        deviceSockets.delete(socket.deviceId);
        deviceStates.delete(socket.deviceId);
        ioClients.forEach(c => c.emit("state", {
          deviceId: socket.deviceId,
          disconnected: true
        }));
      }
      ioClients.delete(socket);
      console.log(`❌ Frontend client disconnected`);
    });

    socket.on("command", ({ deviceId, command }) => {
      const dev = deviceSockets.get(deviceId);
      if (dev) dev.emit("command", { command });
    });
  });
}

export function getDeviceSocket(deviceId) {
  return deviceSockets.get(deviceId);
}

export function getValveState(deviceId) {
  return deviceStates.get(deviceId) || { state: "unknown", extra: null };
}

export function sendCommandToDevice(deviceId, command) {
  const s = getDeviceSocket(deviceId);
  if (!s) throw new Error(`Device ${deviceId} not connected`);
  s.emit("command", { command });
}
