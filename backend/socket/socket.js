const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
require("dotenv").config();
console.log(process.env.URL);
const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ['GET', 'POST']
    }
});

const userSocketMap = {}; // this map stores socket id corresponding to the user id; userId -> socketId

const getRecieverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    // console.log(`User Connected: UserId ${userId}, socketId ${socket.id}`);

    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
            console.log(
                    //   `User Disconnected: UserId ${userId}, socketId ${socket.id}`
                    );
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// Exporting the app, server, and io objects
module.exports = { app, server, io, getRecieverSocketId };





