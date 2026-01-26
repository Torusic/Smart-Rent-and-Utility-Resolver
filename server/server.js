import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http'; // 👈 required for socket.io
import { Server } from 'socket.io';
import axios from 'axios';

import connectDB from './config/connectDB.js';
import LandLordRoute from './routes/LandLord.route.js';
import mpesaRoute from './routes/mpesa.route.js';
import TenantModel from './models/Tenant.model.js';

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// routes
app.use('/api/LandLord', LandLordRoute);
app.use('/api/mpesa',mpesaRoute)

// create http server for socket.io
const server = http.createServer(app);

// socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // ESP32 registers itself with room/house ID
  socket.on('registerDevice', (deviceId) => {
    socket.join(deviceId);
    console.log(`ESP32 registered: ${deviceId}`);
  });

  // React sends command to ESP32 (relay ON/OFF)
  socket.on('controlCommand', ({ deviceId, command }) => {
    console.log(`Command to ${deviceId}:`, command);
    io.to(deviceId).emit('deviceCommand', command);
  });

  // ESP32 sends status (relay state, power, water, etc.)
  socket.on('deviceStatus', async (data) => {
  console.log('ESP32 Status:', data);

  const tenant = await TenantModel.findOne({ deviceId: data.deviceId });
  if (!tenant) return;

  // Auto cut-off logic
  if (tenant.payment.balance > 0) {
    io.to(data.deviceId).emit("deviceCommand", {
      power: "OFF",
      water: "OFF"
    });
  } else {
    io.to(data.deviceId).emit("deviceCommand", {
      power:"ON",
      water: "ON"
    });
  }

  // Update units from ESP32
  tenant.utilities.water.units = data.waterUnits;
  tenant.utilities.electricity.units = data.powerUnits;

  tenant.utilities.water.amount = data.waterUnits * 5;
  tenant.utilities.electricity.amount = data.powerUnits * 20;

  await tenant.save();

  // Broadcast to dashboards
  io.emit('statusUpdate', {
    room: tenant.room,
    water: tenant.utilities.water,
    electricity: tenant.utilities.electricity
  });
});

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// start server
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});

export { io };
