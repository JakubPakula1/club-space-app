const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    console.log("Otrzymane dane:", { username, room });

    // Sprawdzenie czy dane są zdefiniowane
    if (!username || !room) {
      console.log("Brak wymaganych danych:", { username, room });
      return;
    }

    socket.join(room);
    socket.username = username;
    socket.currentRoom = room;

    console.log(`Użytkownik ${username} dołączył do pokoju ${room}`);

    if (!activeUsers.has(room)) {
      activeUsers.set(room, new Set());
    }
    activeUsers.get(room).add(username);
    console.log(activeUsers);
    io.to(room).emit("activeUsers", {
      users: Array.from(activeUsers.get(room)),
    });
  });

  socket.on("typing", ({ room, username }) => {
    io.in(room).emit("userTyping", { username });
  });

  socket.on("stopTyping", ({ room, username }) => {
    io.in(room).emit("userStopTyping", { username });
  });

  socket.on("chatMessage", ({ room, message }) => {
    console.log(`mam message ${message} z pokoju ${room}`);
    io.to(room).emit("message", {
      type: "chat",
      username: socket.username,
      text: message,
      timestamp: new Date(),
    });
  });

  // Opuszczanie pokoju
  socket.on("leaveRoom", () => {
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }
    if (socket.currentRoom && socket.username) {
      const roomUsers = activeUsers.get(socket.currentRoom);
      if (roomUsers) {
        roomUsers.delete(socket.username);
        io.to(socket.currentRoom).emit("activeUsers", {
          users: Array.from(roomUsers),
        });
      }
    }
  });

  // Rozłączenie
  socket.on("disconnect", () => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit("message", {
        type: "system",
        text: `${socket.username} został rozłączony`,
        timestamp: new Date(),
      });
    }
    if (socket.currentRoom && socket.username) {
      const roomUsers = activeUsers.get(socket.currentRoom);
      if (roomUsers) {
        roomUsers.delete(socket.username);
        io.to(socket.currentRoom).emit("activeUsers", {
          users: Array.from(roomUsers),
        });
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});
