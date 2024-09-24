import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  return: {
    type: Boolean,
    default: false,
  },
  applicants: {
    type: Array,
    default: [],
  },
  status: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
