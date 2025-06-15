import express from "express";
import { privateRoute, signin, signup } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/privateRoute", verifyToken , privateRoute);

export default router;
