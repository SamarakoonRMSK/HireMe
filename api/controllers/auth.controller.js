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
    !fullName ||
    username == "" ||
    email == "" ||
    password == "" ||
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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return next(errorHandler(404, "User not found"));
    }
    const isValidPassword = bcrypt.compareSync(password, findUser.password);
    if (!isValidPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      {
        id: findUser._id,
        role: findUser.role,
      },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = findUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
