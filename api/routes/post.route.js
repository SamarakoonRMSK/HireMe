import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  applyForVacancy,
  createPost,
  filterPosts,
  getPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create/:userId", verifyToken, createPost);
router.get("/getposts", getPosts);
router.get("/getjobs", verifyToken, filterPosts);
router.put("/updatepost/:postId/:userId", verifyToken, applyForVacancy);

export default router;
