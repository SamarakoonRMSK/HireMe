import Notification from "../models/notification.model.js";


export const getLatestNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find()
        .sort({ createdAt: -1 }) 
        .limit(5) 
        .populate("customerId");
  
      res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching notifications",
      });
    }
  };