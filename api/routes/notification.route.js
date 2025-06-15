import express from "express";
import { getLatestNotifications } from "../controllers/notification.controller.js";
import { verifyToken } from "../utils/verifyUser.js";



const router = express.Router();

router.get("/latest",verifyToken, getLatestNotifications);

export default router;