import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isOnline:{
      type: Boolean,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      }
    },
    profilePicture: {
      type: String,
      default:
        "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
    },
    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      required: true,
      default: "customer",
    },

    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },
    perHour: {
      type: Number,
      required: function () {
        return this.role === "driver";
      },
    },
    licenceNumber: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },
    policeReport: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },
    vType: {
      type: [String],
      required: function () {
        return this.role === "driver";
      },
    },
    rate: {
      type: [Number],
      required: function () {
        return this.role === "driver";
      },
    },
    about: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },
    dob: {
      type: Date,
      required: function () {
        return this.role === "driver";
      },
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
