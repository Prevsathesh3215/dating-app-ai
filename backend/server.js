const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend origin in production
    methods: ["GET", "POST"]
  }
});

const users = new Map(); // Map<userId, socketId>

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    users.set(userId, socket.id);
  });

  socket.on("send_message", ({ from, to, message }) => {
    const recipientSocket = users.get(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit("receive_message", {
        from,
        message,
        timestamp: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let [userId, socketId] of users) {
      if (socketId === socket.id) users.delete(userId);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Dating app chat backend is running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
