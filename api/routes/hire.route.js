import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createHire,
  getCustomerHires,
} from "../controllers/hire.controller.js";

const router = express.Router();

router.post("/create/:userId/:driverId", verifyToken, createHire);
router.get("/getcustomerhires/:customerId", verifyToken, getCustomerHires);

export default router;
