const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

        // Join user to their personal room
        socket.join(`user:${socket.user.id}`);

        // Join role-based rooms
        socket.join(`role:${socket.user.role}`);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { initializeSocket, getIO };