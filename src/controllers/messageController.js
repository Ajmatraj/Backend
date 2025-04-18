import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.models.js";
import mongoose from "mongoose";
import { z } from "zod";

// Schema validation
const messageSchema = z.object({
  senderId: z.string().min(1, "Sender ID is required"),
  receiverId: z.string().min(1, "Receiver ID is required"),
  content: z.string().min(1, "Message content is required"),
});

// Get messages
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  }).sort({ createdAt: 1 });

  if (!messages.length) {
    return res.status(404).json(new ApiResponse(404, null, "No messages found"));
  }

  res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

// Send message
const sendMessage = asyncHandler(async (req, res) => {
  const validation = messageSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, validation.error.errors.map(e => e.message).join(", "));
  }

  const { senderId, receiverId, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new ApiError(400, "Invalid receiverId.");
  }

  const newMessage = await Message.create({ senderId, receiverId, content });

  const payload = {
    senderId,
    receiverId,
    content,
    createdAt: newMessage.createdAt
  };

  req.io.emit("chat", payload);

  res.status(201).json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

export { getMessages, sendMessage };
