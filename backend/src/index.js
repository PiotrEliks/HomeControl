import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import cookieParser from "cookie-parser";
import { initSocket } from './lib/socket.js';
import authRoutes from './routes/auth.route.js';
import valveRoutes from './routes/valve.route.js';
import { connectDB } from './lib/db.js';
import { loadSchedulesFromDB } from './lib/cronTasks.js';

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/valve', valveRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  connectDB();
  loadSchedulesFromDB();
});
