import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password, role, fullName } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    !role ||
    !fullName ||
    username == "" ||
    email == "" ||
    password == "" ||
    role == "" ||
    fullName == ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPass = bcrypt.hashSync(password, 10);

  if (role === "driver") {
    const { address, licenceNumber, policeReport, vType, about, dob } =
      req.body;
    if (
      !dob ||
      !address ||
      !licenceNumber ||
      !policeReport ||
      !vType ||
      !about ||
      address == "" ||
      licenceNumber == "" ||
      policeReport == "" ||
      vType == "" ||
      about == "" ||
      dob == ""
    ) {
      next(errorHandler(400, "All fields are required"));
    }
    try {
      const newUser = User({
        username,
        email,
        password: hashedPass,
        role,
        fullName,
        address,
        licenceNumber,
        policeReport,
        vType,
        about,
        dob: new Date(dob),
      });
      await newUser.save();
      res.json("signup is successfull");
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const newUser = User({
        username,
        email,
        password: hashedPass,
        role,
        fullName,
      });
      await newUser.save();
      res.json("signup is successfull");
    } catch (error) {
      next(error);
    }
  }
};
