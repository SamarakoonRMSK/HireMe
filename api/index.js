// npm i express bcryptjs dotenv jsonwebtoken mongoose cookie-parser
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

// MongoDb Connection -----------------
mongoose
  .connect(process.env.MONGO, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json());
app.use(cookieParser());
//Routes-------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

// Middlewa Error Handle -----------------
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// saman3@gmail.com - 66eeb415186cf4ea50484c52
// saman4@gmail.com - 66eeb45e7b1068d3b6cf1e3c
