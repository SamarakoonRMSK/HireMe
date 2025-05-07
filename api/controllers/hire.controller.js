import { errorHandler } from "../utils/error.js";
import Hire from "../models/hire.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

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

    const newNotification = Notification({
      customerId: req.user.id,
      description:"You have been added to the new hire.",
      price:req.body.price,
    });
    await newNotification.save();

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
      status: {$in : ["Completed","Accepted"]},
      paymentStatus: "Pending"
    });
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
};

  export const customerPendingHires = async (req, res, next) => {
    try {
      if (req.user.role !== "customer") {
        return next(403, "You are not allowed to get Hires");
      }
      if (req.user.id !== req.params.customerId) {
        return next(403, "You are not allowed to get hires");
      }
      const hires = await Hire.find({
        customerId: req.params.customerId,
        status: "Pending",
      });
      res.status(200).json(hires);
    } catch (error) {
      next(error);
    }
  };

  export const cancelHireByCustomer = async (req, res, next) => {
    try {
      const { hireId, customerId } = req.params;
      if (req.user.role !== 'customer' || req.user.id !== customerId) {
        return next(403, 'Unauthorized');
      }
      const hire = await Hire.findById(hireId);
      if (!hire) {
        return next(errorHandler(404, "Hire record not found"));
      }
      hire.status = "Cancelled";
      await hire.save();
      res.status(200).json({ message: 'Hire cancelled successfully' });
    } catch (error) {
      next(error);
    }
  };

export const updateHireStatus = async (req, res) => {
  try {
    const { hireId, feedback, rate } = req.body;


    if (!feedback || typeof feedback !== 'string') {
      return next(400,'Feedback is required');
    }
    if (typeof rate !== 'number' || rate < 0 || rate > 5) {
      return next(400,'Rating must be between 0 and 5');
    }
    const hire = await Hire.findById(hireId);
    if (!hire) {
      return next(404,'Hire not found');
    }
    hire.feedback = feedback;
    hire.rating = rate;
    hire.paymentStatus = 'Paid';
    await hire.save();
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    next(500, 'Server error' );
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
      paymentStatus:"Paid"
    });
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
};
export const getCompleteHiresByAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(403, "You are not allowed to get Hires");
    }
    if (req.user.id !== req.params.adminId) {
      return next(403, "You are not allowed to get hires");
    }
    const hires = await Hire.find({
      status: "Completed",
    });
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
};


export const getDriverHires = async (req, res, next) => {
  try {
    const { driverId } = req.params;
    if (!req.user || req.user.role !== 'driver' || req.user.id !== driverId) {
      return next(403,'Unauthorized: Only drivers can view their hires');
    }
    const hires = await Hire.find({
      driverId,
      status: { $in: ['Accepted', 'Completed'] },
      paymentStatus: 'Pending',
    });

    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
};

export const notifyCustomerComplete = async (req, res, next) => {
  try {
    const { hireId, driverId } = req.params;

    if (!req.user || req.user.role !== 'driver' || req.user.id !== driverId) {
      return next(403,'Unauthorized: Only drivers can notify completion');
    }
    const hire = await Hire.findById(hireId);
    if (!hire) {
      return next(404,'Hire not found');
    }

    if (hire.status !== 'Accepted') {
      return next(400,`Hire cannot be marked completed (current status: ${hire.status})`);
    }

    hire.status = 'Completed';
    await hire.save();
    res.status(200).json({ message: 'Customer notified successfully', hire });
  } catch (error) {
    next(error);
  }
};

export const getCompleteDriverHires = async(req,res,next)=>{
  try {
    if (req.user.role !== "driver") {
      return next(403, "You are not allowed to get Hires");
    }
    if (req.user.id !== req.params.driverId) {
      return next(403, "You are not allowed to get hires");
    }
    const hires = await Hire.find({
      driverId: req.params.driverId,
      status: "Completed",
    });
    
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
}

export const getCompleteDriverFeedback = async(req,res,next)=>{
  try {
    if (req.user.role !== "customer") {
      return next(403, "You are not allowed to get Hires");
    }
    const hires = await Hire.find({
      driverId: req.params.driverId,
      status: "Completed",
    }).populate('customerId'); // This will populate the driver object
    
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
}
export const getRejectedHires = async(req,res,next)=>{
  try {
    if (req.user.role === "admin") {
      return next(403, "You are not allowed to get Hires");
    }
    if(req.user.role === "driver"){
      var hires = await Hire.find({
        driverId: req.params.userId,
        status: "Cancelled",
      }).populate(['customerId','driverId']);
    }else{
      var hires = await Hire.find({
        customerId: req.params.userId,
        status: "Cancelled",
      }).populate(['customerId','driverId']);
    }
      // This will populate the driver object
    
    res.status(200).json(hires);
  } catch (error) {
    next(error);
  }
}

export const driverIncomingHires = async (req, res, next) => {
  try {
    const { driverId } = req.params;
    if (!req.user || req.user.role !== 'driver' || req.user.id !== driverId) {
      console.error('Unauthorized access attempt:', { role: req.user?.role, userId: req.user?.id, driverId });
      return res.status(403).json({ message: 'Unauthorized: Only drivers can view their incoming hires' });
    }

    const hires = await Hire.find({
      driverId,
      status: 'Pending',
    });

    res.status(200).json(hires);
  } catch (error) {
    console.error('Error in driverIncomingHires:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rejectHireByDriver = async (req, res, next) => {
  try {
    const { hireId, driverId } = req.params;
    if (!req.user || req.user.role !== 'driver' || req.user.id !== driverId) {
      console.error('Unauthorized access attempt:', { role: req.user?.role, userId: req.user?.id, driverId });
      return next(403,'Unauthorized: Only drivers can reject hires');
    }
    const hire = await Hire.findById(hireId);
    if (!hire) {
      return next(404,'Hire not found');
    }
    if (hire.status !== 'Pending') {
      return next(400,`Hire cannot be rejected (current status: ${hire.status})`);
    }
    hire.status = 'Cancelled';
    await hire.save();
    res.status(200).json({ message: 'Hire rejected successfully' });
  } catch (error) {
    console.error('Error in rejectHireByDriver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const acceptHireByDriver = async (req, res, next) => {
  try {
    const { hireId, driverId } = req.params;

    if (!req.user || req.user.role !== 'driver' || req.user.id !== driverId) {
      return next(403,'Unauthorized: Only drivers can reject hires');
    }
    const hire = await Hire.findById(hireId);
    if (!hire) {
      return next(404,'Hire not found');
    }
    if (hire.status !== 'Pending') {
      return next(400,`Hire cannot be rejected (current status: ${hire.status})`);
    }

    hire.status = 'Accepted';
    await hire.save();
    res.status(200).json({ message: 'Hire accepted successfully' });
  } catch (error) {
    console.error('Error in acceptHireByDriver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};