import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cors());


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


let ledState = false;


app.post("/api/led/on", (req, res) => {
  if (deviceSocket) {
    deviceSocket.emit("command", { command: "on" });
    res.json({ message: "Polecenie włączenia wysłane" });
  } else {
    res.status(500).json({ error: "Urządzenie nie jest połączone" });
  }
});

app.post("/api/led/off", (req, res) => {
  if (deviceSocket) {
    deviceSocket.emit("command", { command: "off" });
    res.json({ message: "Polecenie wyłączenia wysłane" });
  } else {
    res.status(500).json({ error: "Urządzenie nie jest połączone" });
  }
});

app.get("/api/led/state", (req, res) => {
  res.json({ led: ledState });
});


const server = http.createServer(app);


const io = new SocketIOServer(server, {
  cors: {
    origin: "*"
  }
});


let deviceSocket = null;
const frontendSockets = new Set();

io.on("connection", (socket) => {
  console.log("Nowe połączenie socket.io");


  socket.on("register", (data) => {
    console.log(data)
    console.log("Nowe połączenie socket.io");
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

      socket.emit("state", { state: ledState });
    }
  });


  socket.on("update", (data) => {
    if (data.state !== undefined) {
      ledState = data.state;

      frontendSockets.forEach((client) => {
        if (client.connected) {
          client.emit("state", { state: ledState });
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

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
