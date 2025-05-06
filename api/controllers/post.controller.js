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
    !req.body.vType ||
    !req.body.price ||
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

export const applyForVacancy = async (req, res, next) => {
  if (req.user.id !== req.params.userId || req.user.role !== "driver") {
    return next(
      errorHandler(403, "You are not allowed to apply this vacancy!")
    );
  }
  const newApplicant = {
    userId: req.user.id,
    image: req.body.image,
    email: req.body.email,
    username: req.body.username,
    rating: req.body.rating,
  };

  try {
    const post = await Post.findById(req.params.postId);
    const hasApplied = post.applicants.some(
      (applicant) => applicant.userId === req.user.id
    );
    if (hasApplied) {
      return next(errorHandler(400, "You have already applied"));
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { applicants: newApplicant },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const getPostsByAdmin = async(req,res,next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.postId && { _id: req.query.postId }),

    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
}

export const filterPosts = async (req, res, next) => {
  try {
    if (req.user.role !== "driver") {
      return next(errorHandler(403, "You are not allowed to apply vacancy!"));
    }

    const { from, to, duration, return: isReturn, vType, price } = req.query;

    let filter = { status: false };
    if (from) filter.from = from;
    if (to) filter.to = to;
    if (duration) filter.duration = { $gt: Number(duration) - 1 };
    if (isReturn !== undefined) filter.return = isReturn === "true";
    if (vType) filter.vType = vType;
    if (price) filter.price = { $gt: Number(price) - 1 };

    const posts = await Post.find(filter);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.role === "admin" || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The Job has been deleted");
  } catch (error) {
    next(error);
  }
};
