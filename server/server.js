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

// socket.io events
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // when someone sends a message
  socket.on('sendMessage', (message) => {
    // TODO: save message to DB here before broadcasting

    // broadcast to all connected clients
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log(' User disconnected:', socket.id);
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
