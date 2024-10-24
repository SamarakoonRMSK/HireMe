// npm i express bcryptjs dotenv jsonwebtoken mongoose cookie-parser
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import hireRoutes from "./routes/hire.route.js";
import payRoutes from "./routes/payment.route.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

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

// const app = express();

app.use(express.json());
app.use(cookieParser());
//Routes-------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/hire", hireRoutes);
app.use("/api/pay", payRoutes);

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

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
