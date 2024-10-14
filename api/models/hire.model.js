import mongoose from "mongoose";

const HireSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  driverId: {
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
  duration: {
    type: Number,
    required: true,
  },
  vType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  return: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Not Completed",
  },
  rate: {
    type: Number,
  },
  feedback: {
    type: String,
  },
});

const Hire = mongoose.model("Hire", HireSchema);
export default Hire;
