import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getUsers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const senderId = req.user.id;
    if (userId !== senderId) {
      return next(errorHandler(401, "Unauthorized"));
    }
    const users = await Conversation.find({ participants: userId }).populate(
      "participants"
    );

    const otherParticipants = users.flatMap((conversation) =>
      conversation.participants.filter(
        (participant) => !participant._id.equals(userId)
      )
    );

    res.status(200).json(otherParticipants);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { receiverId, userId } = req.params;
    const senderId = req.user.id;

    if (userId !== senderId) {
      return next(errorHandler(401, "You are not allowed to message!"));
    }
    if (req.params.userId === req.params.receiverId) {
      return next(errorHandler(403, "You cannot message yourself!"));
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, req.params.receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, req.params.receiverId],
      });

      const newUser = await User.findById(senderId);
      const sender = await User.findById(receiverId);

      const socketId = getReceiverSocketId(receiverId);
      const userSocketId = getReceiverSocketId(senderId);
      if (socketId && userSocketId) {
        io.to(socketId).emit("newUser", newUser);
        io.to(userSocketId).emit("newUser", sender);
      }
    }
    const newMessage = new Message({
      senderId,
      receiverId: req.params.receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
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
