import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createHire,
  getCompleteHires,
  getCustomerHires,
  updateHireStatus,
} from "../controllers/hire.controller.js";

const router = express.Router();

router.post("/create/:userId/:driverId", verifyToken, createHire);
router.get("/getcustomerhires/:customerId", verifyToken, getCustomerHires);
router.get("/get-complete-hires/:customerId", verifyToken, getCompleteHires);
router.put("/update-status", verifyToken, updateHireStatus);

export default router;
