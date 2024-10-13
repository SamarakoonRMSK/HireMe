import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getMessages,
  getUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", verifyToken, getMessages);
router.get("/getusers/:userId", verifyToken, getUsers);
router.post("/send/:userId/:receiverId", verifyToken, sendMessage);

export default router;
