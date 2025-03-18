import mongoose from "mongoose";

// Updated FuelStation Schema
const FuelStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    stock: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    imageurl: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fuelTypes: [
      {
        fuelType: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FuelType",
          required: true,
          lowercase:true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

export const FuelStation = mongoose.model("FuelStation", FuelStationSchema);
