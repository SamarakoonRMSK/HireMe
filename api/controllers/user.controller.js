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
            perHour: req.body.perHour
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
  if (req.user.role === "driver") {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const filters = { role: "driver" };

    if (req.query.vType) {
      filters.vType = { $in: [req.query.vType] };
    }

    const aggregatePipeline = [
      { $match: filters },
      {
        $addFields: {
          avgRate: { $avg: "$rate" },
        },
      },
    ];

    if (parseInt(req.query.rate) === 1) {
      aggregatePipeline.push({
        $sort: { avgRate: -1 },
      });
    } else {
      aggregatePipeline.push({
        $sort: { createdAt: sortDirection },
      });
    }
    aggregatePipeline.push({ $skip: startIndex }, { $limit: limit });

    const users = await User.aggregate(aggregatePipeline);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    const totalUsers = await User.countDocuments({ role: "driver" });

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      role: "driver",
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

export const filterDrivers = async (req, res, next) => {
  try {
    
    const { location } = req.body;
    
    if (!location) {
      return next(400, "Customer location coordinates are required");
    }
    
    
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    
    const filters = { role: "driver" };
    
    
    if (req.query.isOnline === "true") {
      filters.isOnline = true;
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filters.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
      ];
    }
    
    if (req.query.vType) {
      filters.vType = { $in: [req.query.vType] };
    }
    
    const aggregatePipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: location?.coordinates,
          },
          distanceField: "distance",
          spherical: true,
          query: filters,
        },
      },
      {
        $addFields: {
          avgRate: { $avg: "$rate" },
          distanceKm: { $round: [{ $divide: ["$distance", 1000] }, 2] },
        },
      },
    ];
    
    if (req.query.sort === "distance") {
      aggregatePipeline.push({
        $sort: { distance: 1 },
      });
    } else if (req.query.sort === "rate") {
      aggregatePipeline.push({
        $sort: { avgRate: -1 },
      });
    } else {
      const sortDirection = req.query.sort === "asc" ? 1 : -1;
      aggregatePipeline.push({
        $sort: { createdAt: sortDirection },
      });
    }

    
    aggregatePipeline.push(
      { $skip: startIndex },
      { $limit: limit },
      {
        $project: {
          password: 0,
        },
      }
    );
    const drivers = await User.aggregate(aggregatePipeline);

    const totalDrivers = await User.countDocuments({ role: "driver" });

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthDrivers = await User.countDocuments({
      role: "driver",
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      drivers,
      totalDrivers,
      lastMonthDrivers,
    });
  } catch (error) {
    next(error);
  }
};
export const getCustomers = async (req, res, next) => {
  if (req.user.role === "customer") {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const filters = { role: "customer" };

    const aggregatePipeline = [
      { $match: filters },
    ];

    aggregatePipeline.push({
        $sort: { createdAt: sortDirection },
      });
    aggregatePipeline.push({ $skip: startIndex }, { $limit: limit });

    const users = await User.aggregate(aggregatePipeline);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    const totalUsers = await User.countDocuments({ role: "customer" });

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      role: "customer",
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

export const getDriver = async (req,res,next)=>{
  try {
    const driver = await User.findOne({ _id:req.params.driverId,role: "driver" });
    if(!driver){
      return next(errorHandler(404,"Driver id not exist"));
    }
    const { password, ...rest } = driver._doc;
    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
}

export const getAllDrivers = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(403, "You are not allowed to see all drivers"));
  }
  try {
    const drivers = await User.find({ role: "driver" });
    const driversWithoutPass = drivers.map((driver) => {
      const { password, ...rest } = driver;
      return driver;
    });
    res.status(200).json(driversWithoutPass);
  } catch (error) {
    next(error);
  }
};

export const verifyDriver = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(403, "You are not allowed to see all drivers"));
  }
  try {
    const driver = await User.findByIdAndUpdate(req.params.driverId, {
      isVerify: true,
    });
    const { password, ...rest } = driver;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
