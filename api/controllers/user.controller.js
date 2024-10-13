import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("User sign out");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "you are not allowed to update this user"));
  }
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  try {
    const user = await User.findById(req.params.userId);

    if (req.body.email) {
      if (user.email !== req.body.email) {
        const isEmailExist = await User.findOne({ email: req.body.email });
        if (isEmailExist) {
          return next(errorHandler(409, "Email is already exist"));
        }
      }
    }

    if (req.body.role === "customer") {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
          },
        },
        { new: true }
      );
      const { password: pass, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } else if (req.body.role === "driver") {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
            address: req.body.address,
            licenceNumber: req.body.licenceNumber,
            policeReport: req.body.policeReport,
            vType: req.body.vType,
            about: req.body.about,
            dob: req.body.dob,
          },
        },
        { new: true }
      );
      const { password: pass, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const getusers = async (req, res, next) => {
  if (req.user.role !== "customer") {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find({ role: "driver" })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.find({ role: "driver" }).countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.find({ role: "driver" }).countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
