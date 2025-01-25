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

    socket.to(room).emit("message", {
      type: "system",
      text: `${username} dołączył do pokoju`,
      timestamp: new Date(),
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
      socket.to(socket.currentRoom).emit("message", {
        type: "system",
        text: `${socket.username} opuścił pokój`,
        timestamp: new Date(),
      });
      socket.leave(socket.currentRoom);
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
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});
