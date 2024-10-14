import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createHire } from "../controllers/hire.controller.js";

const router = express.Router();

router.post("/create/:userId/:driverId", verifyToken, createHire);

export default router;
