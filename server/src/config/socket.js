const { Server } = require('socket.io');
const env = require('./env');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    socket.on('join_execution', (executionId) => {
      socket.join(`execution:${executionId}`);
      console.log(`📡 Socket ${socket.id} joined room execution:${executionId}`);
    });

    socket.on('leave_execution', (executionId) => {
      socket.leave(`execution:${executionId}`);
      console.log(`📡 Socket ${socket.id} left room execution:${executionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected from Socket.IO: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    // Return dummy emitter if IO not initialized yet
    return {
      to: () => ({
        emit: (event, data) => {
          console.log(`[Socket Mock] ${event}:`, data);
        },
      }),
      emit: (event, data) => {
        console.log(`[Socket Mock Emit] ${event}:`, data);
      },
    };
  }
  return io;
};

module.exports = { initSocket, getIO };
