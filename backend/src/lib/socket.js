import { Server as SocketIOServer } from "socket.io";

let deviceSocket = null;
const frontendSockets = new Set();
let valveState = false;

function initSocket(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true,
    },
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    console.log("Nowe połączenie socket.io");

    socket.on("register", (data) => {
      console.log("Rejestracja, odebrane dane:", data);
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error("Błąd parsowania danych rejestracyjnych:", e);
          return;
        }
      }
      if (data.role === "device") {
        deviceSocket = socket;
        console.log("Urządzenie zarejestrowane");
      } else if (data.role === "frontend") {
        frontendSockets.add(socket);
        console.log("Frontend zarejestrowany");
        socket.emit("state", { state: valveState });
      }
    });

    socket.on("update", (data) => {
      if (data.state !== undefined) {
        valveState = data.state;
        console.log("update", valveState)
        frontendSockets.forEach((client) => {
          if (client.connected) {
            client.emit("state", { state: valveState });
          }
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      if (socket === deviceSocket) {
        deviceSocket = null;
      }
      frontendSockets.delete(socket);
    });
  });
}

export { initSocket, getDeviceSocket, getValveState };

function getDeviceSocket() {
  return deviceSocket;
}

function getValveState() {
  return valveState;
}
