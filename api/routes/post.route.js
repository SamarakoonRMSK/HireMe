import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { applyForVacancy, createPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create/:userId", verifyToken, createPost);
router.put("/updatepost/:postId/:userId", verifyToken, applyForVacancy);

export default router;
