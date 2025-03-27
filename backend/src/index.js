import dotenv from "dotenv";
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {  
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

let connectedDevice = null;
let ledState = false;

app.post('/api/led/on', (req, res) => {
  if (connectedDevice && connectedDevice.readyState === connectedDevice.OPEN) {
    connectedDevice.send(JSON.stringify({ command: 'on' }));
    res.json({ message: 'Polecenie włączenia wysłane' });
  } else {
    res.status(500).json({ error: 'Urządzenie nie jest połączone' });
  }
});

app.post('/api/led/off', (req, res) => {
  if (connectedDevice && connectedDevice.readyState === connectedDevice.OPEN) {
    connectedDevice.send(JSON.stringify({ command: 'off' }));
    res.json({ message: 'Polecenie wyłączenia wysłane' });
  } else {
    res.status(500).json({ error: 'Urządzenie nie jest połączone' });
  }
});

app.get('/api/led/state', (req, res) => {
  res.json({ led: ledState });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log('ESP8266 połączone przez WebSocket');
  connectedDevice = ws;

  ws.on('message', function message(data) {
    console.log('Otrzymano od urządzenia:', data.toString());
    try {
      const msg = JSON.parse(data);
      if (msg.state !== undefined) {
        ledState = msg.state;
      }
    } catch (e) {
      console.error('Błąd parsowania wiadomości z ESP:', e);
    }
  });

  ws.on('close', () => {
    console.log('ESP8266 rozłączone');
    connectedDevice = null;
  });
});

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});