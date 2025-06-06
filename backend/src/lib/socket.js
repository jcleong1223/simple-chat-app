import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    /****** Will return the socketId of the user, if pass the user id ******/
    return userSocketMap[userId];
}

/****** Used to store the online users based on the websocket connection ******/
const userSocketMap = {}; /****** {userId: socketId} ******/

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) {
        userSocketMap[userId] = socket.id;
    }

    /****** io.emit() is used to send events to all the connected clients, basically broadcasting it ******/
    io.emit("getOnlineUsers", Object.values(userSocketMap));
    /****** The "getOnlineUsers" can be any name ******/

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);

        /****** Delete the user from the map when they disconnect ******/
        delete userSocketMap[userId];

        /****** The new list of connected users ******/
        io.emit("getOnlineUsers", Object.values(userSocketMap));
    });
})

export { io, server, app };