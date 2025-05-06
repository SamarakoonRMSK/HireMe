import mongoose from "mongoose";

const HireSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
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
  distance: {
    type: Number,
    required: true,
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
    default: "Pending",
  },
  rate: {
    type: Number,
  },
  feedback: {
    type: String,
  },
},{ timestamps: true });

const Hire = mongoose.model("Hire", HireSchema);
export default Hire;
