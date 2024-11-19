import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getAllDrivers,
  getusers,
  signout,
  updateUser,
  verifyDriver,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signout", signout);
router.put("/update/:userId", verifyToken, updateUser);
router.get("/getusers", verifyToken, getusers);
router.get("/alldrivers", verifyToken, getAllDrivers);
router.put("/verifydriver/:driverId", verifyToken, verifyDriver);

export default router;
