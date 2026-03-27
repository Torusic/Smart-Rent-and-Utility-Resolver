import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';

import connectDB from './config/connectDB.js';
import LandLordRoute from './routes/LandLord.route.js';
import mpesaRoute from './routes/mpesa.route.js';
import TenantModel from './models/Tenant.model.js';
import aiRoute from './routes/ai.route.js';

dotenv.config();
const app = express();


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


app.use('/api/LandLord', LandLordRoute);
app.use('/api/mpesa', mpesaRoute);
app.use('/api/ai', aiRoute);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true, 
});


io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("joinUser", (userId) => {
  socket.join(userId);
  console.log("User joined room:", userId);
});

  
  socket.on("registerDevice", async (data) => {
    const deviceId = data.deviceId;
    socket.join(deviceId);

    const tenant = await TenantModel.findOne({ deviceId });
    if (!tenant) return;

    // Send initial relay state
    socket.emit("deviceCommand", {
      electricity: tenant.utilities.electricityStatus || "OFF",
      water: tenant.utilities.waterStatus || "OFF"
    });

    console.log("Relay state synced to ESP32:", deviceId);
  });

  // Frontend sends command to ESP32
  socket.on("controlCommand", ({ deviceId, command }) => {
    console.log(`⚡ Command to ${deviceId}:`, command);
    io.to(deviceId).emit("deviceCommand", command);
  });

  // ESP32 sends live status
  socket.on("deviceStatus", async (data) => {
  try {

    const tenant = await TenantModel.findOne({
      deviceId: data.deviceId
    });

    if (!tenant) return;

    const cutoff = tenant.payment?.balance > 0;

    let electricityStatus = cutoff ? "OFF" : "ON";
    let waterStatus = cutoff ? "OFF" : "ON";

    tenant.relay = tenant.relay || {};
    tenant.utilities = tenant.utilities || {};
    tenant.utilities.electricity = tenant.utilities.electricity || {};
    tenant.utilities.water = tenant.utilities.water || {};

    tenant.relay.electricity = electricityStatus === "ON";
    tenant.relay.water = waterStatus === "ON";

    tenant.utilities.electricityStatus = electricityStatus;
    tenant.utilities.waterStatus = waterStatus;

    tenant.utilities.electricity.units = data.powerUnits || 0;
    tenant.utilities.water.units = data.waterUnits || 0;

    tenant.utilities.electricity.amount =
      (data.powerUnits || 0) * 20;

    tenant.utilities.water.amount =
      (data.waterUnits || 0) * 5;

    await tenant.save();

    io.to(data.deviceId).emit("deviceCommand", {
      electricity: electricityStatus,
      water: waterStatus
    });

  } catch (err) {
    console.error("Device status error:", err);
  }
});

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});

export { io };
