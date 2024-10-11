import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { errorHandler } from "../utils/error.js";
import { getReceiverSocketId } from "../index.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { receiverId, userId } = req.params;
    const senderId = req.user.id;
    if (userId !== senderId) {
      return next(errorHandler(403, "You are not allowed to message!"));
    }
    if (userId === receiverId) {
      return next(errorHandler(403, "You are not allowed to message!"));
    }
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    next(errorHandler(500, "Internal server error"));
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    next(errorHandler(500, "Internal server error"));
  }
};
