// This file implements the server code for the game.

const path = require('path');
const express = require('express');
const winston = require('winston');
const socketio = require('socket.io');

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
const Master = require('./master.js');
const master = new Master();
logger.info('Master created');

// ===== Express server =====
const app = express();

// Serve static files from ../public
app.use(express.static(path.join(__dirname, '../public')));

// Serve p5.js from ../node_modules/p5/lib
app.use('/lib', express.static(path.join(__dirname, '../node_modules/p5/lib')));

// Start server
const PORT = 8080;
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// ===== Socket.io =====
const io = socketio(server);
global.io = io;
logger.info('Sockets up');

// ===== Socket events =====
io.sockets.on('connection', (socket) => {
    logger.info('Accepting a new client with socket id ' + socket.id);

    socket.on('ready', () => {
        master.ready(socket.id);
    });

    socket.on('clicked', (data) => {
        master.clicked(socket.id, data.col);
    });

    socket.on('leave', () => {
        logger.info('Client is leaving');
        master.leave(socket.id);
    });

    socket.on('again', () => {
        master.again(socket.id);
    });

    socket.on('disconnect', () => {
        logger.info('Server has detected a disconnect');
        master.leave(socket.id);
    });
});
