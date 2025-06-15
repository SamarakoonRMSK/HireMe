import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getAllDrivers,
  getusers,
  signout,
  updateUser,
  verifyDriver,
  getDriver,
  getCustomers,
  filterDrivers
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signout", signout);
router.put("/update/:userId", verifyToken, updateUser);
router.get("/getusers", verifyToken, getusers);
router.post("/getusers", verifyToken, filterDrivers);
router.get("/getcustomers", verifyToken, getCustomers);
router.get("/driver/:driverId",verifyToken,getDriver)
router.get("/alldrivers", verifyToken, getAllDrivers);
router.put("/verifydriver/:driverId", verifyToken, verifyDriver);

export default router;
