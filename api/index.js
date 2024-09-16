// npm i express bcryptjs dotenv jsonwebtoken mongoose cookie-parser
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

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

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
