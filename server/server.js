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

// --------------------- MIDDLEWARES ---------------------
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
  allowEIO3: true, // compatible with ESP32 Socket.IO client
});


io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // ESP32 registers itself
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
    console.log(" ESP32 Status:", data);

    const tenant = await TenantModel.findOne({ deviceId: data.deviceId });
    if (!tenant) return;

    // Auto cut-off based on payment
    //const electricityStatus = tenant.payment.balance > 0 ? "OFF" : "ON";
   // const waterStatus = tenant.payment.balance > 0 ? "OFF" : "ON";

  let electricityStatus = tenant.utilities.electricityStatus;
    let waterStatus = tenant.utilities.waterStatus;

    if (tenant.payment.balance > 0) {
    electricityStatus = "OFF";
    waterStatus = "OFF";
    }

    // Update tenant document
    tenant.relay.electricity = electricityStatus === "ON";
    tenant.relay.water = waterStatus === "ON";

    tenant.utilities.electricityStatus = electricityStatus;
    tenant.utilities.waterStatus = waterStatus;

    tenant.utilities.electricity.units = data.powerUnits;
    tenant.utilities.water.units = data.waterUnits;

    tenant.utilities.electricity.amount = data.powerUnits * 20; 
    tenant.utilities.water.amount = data.waterUnits * 5;        

    await tenant.save();

    // Send updated commands back to ESP32
    io.to(data.deviceId).emit("deviceCommand", {
      electricity: electricityStatus,
      water: waterStatus
    });

    // Broadcast updated status to frontend dashboard
    io.emit("statusUpdate", {
      room: tenant.room,
      electricity: tenant.utilities.electricity,
      water: tenant.utilities.water
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

export { io };
