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
  fromLat: {
    type: Number,
    required: true,
  },
  fromLng: {
    type: Number,
    required: true,
  },
  toLat: {
    type: Number,
    required: true,
  },
  toLng: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
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
  bookingDateTime: {
    type: Date,
    required: true,
  },
  hiringDays: {
    type: Number,
    required: true,
  },
  hiringHours: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  vType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
