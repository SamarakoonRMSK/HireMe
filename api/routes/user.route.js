import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getusers,
  signout,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signout", signout);
router.put("/update/:userId", verifyToken, updateUser);
router.get("/getusers", verifyToken, getusers);

export default router;
