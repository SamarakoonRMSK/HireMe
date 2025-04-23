import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  applyForVacancy,
  createPost,
  deletepost,
  filterPosts,
  getPosts,
  getPostsByAdmin,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create/:userId", verifyToken, createPost);
router.get("/getposts", getPosts);
router.get("/getpostsbyadmin", getPostsByAdmin);
router.get("/getjobs", verifyToken, filterPosts);
router.put("/updatepost/:postId/:userId", verifyToken, applyForVacancy);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);

export default router;
