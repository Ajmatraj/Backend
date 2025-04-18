import mongoose from "mongoose";

// Message schema definition with automatic timestamps
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the 'User' model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the 'User' model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add `createdAt` and `updatedAt` fields automatically
  }
);

// Create the Message model
export const Message = mongoose.model("Message", messageSchema);
