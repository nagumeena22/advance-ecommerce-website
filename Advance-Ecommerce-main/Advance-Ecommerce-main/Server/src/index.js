import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import app from './app.js';
import connectDb from './db/connectToMongodb.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config({ path: './.env' });

// ✅ Apply CORS FIRST (before routes)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Parse JSON (optional if in app.js already)
app.use(express.json());

// ✅ Then mount routes
app.use('/api', authRoutes);

// ✅ Basic test route
app.get('/', (req, res) => {
  res.send("Server is running");
});

// ✅ Setup HTTP server
const server = http.createServer(app);

// ✅ Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ WebSocket handlers
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });

  socket.on('pingServer', () => {
    console.log('📡 Received ping from client');
    socket.emit('pongServer');
  });
});

// ✅ Connect DB and start server
connectDb()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err);
  });
