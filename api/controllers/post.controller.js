import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  if (req.user.role === "driver" || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to create job vacancy"));
  }
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.from ||
    !req.body.to ||
    !req.body.duration ||
    !req.body.vType ||
    req.body.vType === ""
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  try {
    const newPost = new Post({
      ...req.body,
      userId: req.user.id,
    });
    const data = await newPost.save();
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
