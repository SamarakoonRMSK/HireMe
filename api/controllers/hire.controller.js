import { errorHandler } from "../utils/error.js";
import Hire from "../models/hire.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const createHire = async (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
      return next(403, "You are not allowed to hire");
    }
    if (req.user.id !== req.params.userId) {
      return next(403, "You are not allowed to hire");
    }
    if (req.params.driverId) {
      const driver = await User.findById(req.params.driverId);
      if (!driver && driver.role !== "driver") {
        return next(403, "You are not allowed to hire");
      }
    }

    if (
      !req.body.from ||
      !req.body.to ||
      !req.body.duration ||
      !req.body.vType ||
      !req.body.price ||
      req.body.vType === ""
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const newHire = new Hire({
      ...req.body,
      customerId: req.user.id,
      driverId: req.params.driverId,
    });

    if (req.body.postId) {
      await Post.findByIdAndUpdate(
        req.body.postId,
        { $set: { status: true } },
        { new: true }
      );
    }
    const data = await newHire.save();
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getCustomerHires = async (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
      return next(403, "You are not allowed to get Hires");
    }
    if (req.user.id !== req.params.customerId) {
      return next(403, "You are not allowed to get hires");
    }
    const hires = await Hire.find({
      customerId: req.params.customerId,
      status: { $ne: "Completed" },
    });
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
};

export const updateHireStatus = async (req, res) => {
  try {
    const { hireId, feedback, rate } = req.body;

    const hire = await Hire.findById(hireId);
    if (!hire) {
      return next(errorHandler(404, "Hire record not found"));
    }
    const driver = await User.findById(hire.driverId);
    if (!driver) {
      return next(errorHandler(404, "Driver not found"));
    }
    driver.rate.push(rate);

    hire.status = "Completed";
    hire.feedback = feedback;
    hire.rate = rate;

    await Promise.all([driver.save(), hire.save()]);

    res.json({ message: "Hire updated successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getCompleteHires = async (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
      return next(403, "You are not allowed to get Hires");
    }
    if (req.user.id !== req.params.customerId) {
      return next(403, "You are not allowed to get hires");
    }
    const hires = await Hire.find({
      customerId: req.params.customerId,
      status: "Completed",
    });
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
};
