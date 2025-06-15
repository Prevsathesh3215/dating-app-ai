const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const generateChatReview = require('./ai');

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


app.post("/msgprompt", (req, res) => {
  console.log(req.body);

  const msgString = req.body[0].person_one + '\n' + req.body[1].person_two

  console.log(msgString)
  generateChatReview(msgString, 'Act like a dating app chat reviewer. I"m going to send you the recent messages sent, and you"re going to give me 3 suggestions on the next reponse to give. Important: Return the responses in an array of strings. Make the responses also short')
  .then((data) => {
    console.log(data);

    const messages = data
      .split(/\d+\.\s+/)           // Split on "1. ", "2. ", etc.
      .filter(Boolean)             // Remove empty strings (from the start)
      .map(s => s.trim().replace(/^"|"$/g, '')); // Trim and remove quotes


    res.send(messages);
  })
})



app.post("/getreview", (req, res) => {
  
    generateChatReview(req.body, 'Act like a dating app chat reviewer. give some feedback on the conversation made by the user. the review needs to sound so sarcastic and brutally honest. keep the feedback short.')
    .then((data) => {
      console.log(data);
      res.send(data);
    })

})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
