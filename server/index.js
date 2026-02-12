require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const GroupMessage = require("./models/GroupMessage");
const PrivateMessage = require("./models/PrivateMessage");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log("MongoDB error:", e.message));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

function nowString() {
  return new Date().toLocaleString();
}

io.on("connection", (socket) => {
  // user personal room for private messages
  socket.on("registerUser", ({ username }) => {
    socket.join(username);
  });

  // join room
  socket.on("joinRoom", ({ username, room }) => {
    socket.data.username = username;
    socket.data.room = room;
    socket.join(room);
    io.to(room).emit("systemMsg", { message: `${username} joined ${room}` });
  });

  // leave room
  socket.on("leaveRoom", () => {
    const { username, room } = socket.data;
    if (room) {
      socket.leave(room);
      io.to(room).emit("systemMsg", { message: `${username} left ${room}` });
    }
    socket.data.room = null;
  });

  // group message in a room (save to DB)
  socket.on("groupMessage", async ({ from_user, room, message }) => {
    const payload = { from_user, room, message, date_sent: nowString() };
    await GroupMessage.create(payload);
    io.to(room).emit("groupMessage", payload);
  });

  // private message (save to DB) + typing indicator
  socket.on("privateMessage", async ({ from_user, to_user, message }) => {
    const payload = { from_user, to_user, message, date_sent: nowString() };
    await PrivateMessage.create(payload);

    io.to(from_user).emit("privateMessage", payload);
    io.to(to_user).emit("privateMessage", payload);
  });

  socket.on("typing", ({ from_user, to_user }) => {
    io.to(to_user).emit("typing", { from_user });
  });

  socket.on("stopTyping", ({ from_user, to_user }) => {
    io.to(to_user).emit("stopTyping", { from_user });
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
