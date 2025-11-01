// This file implements the server code for the game.

import path from 'path';
import express from 'express';
import winston from 'winston';
import { Server as SocketIO } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Master from './master.js';

// ===== Resolve __dirname =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ===== Logger setup =====
const { combine, timestamp, printf } = winston.format;
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
global.logger = winston.createLogger({
    level: 'debug',
    format: combine(timestamp(), myFormat),
    transports: [
        new winston.transports.File({ filename: 'server.log', level: 'debug' }),
        new winston.transports.Console()
    ]
});

// ===== Game logic =====
const master = new Master();
logger.info('Master created');

// ===== Express server =====
const app = express();

// Serve static files from ../client
app.use(express.static(path.join(__dirname, '../client')));

// Serve p5.js from ../node_modules/p5/lib
app.use('/lib', express.static(path.join(__dirname, '../node_modules/p5/lib')));

// Start server
const PORT = 8080;
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// ===== Socket.io =====
const io = new SocketIO(server);
global.io = io;
logger.info('Sockets up');

// ===== Socket events =====
io.on('connection', (socket) => {
    logger.info('Accepting a new client with socket id ' + socket.id);

    socket.on('ready', () => master.ready(socket.id));
    socket.on('clicked', (data) => master.clicked(socket.id, data.col));
    socket.on('leave', () => {
        logger.info('Client is leaving');
        master.leave(socket.id);
    });
    socket.on('again', () => master.again(socket.id));
    socket.on('disconnect', () => {
        logger.info('Server has detected a disconnect');
        master.leave(socket.id);
    });
});
