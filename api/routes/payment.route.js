import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { checkout } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout", verifyToken, checkout);
export default router;
