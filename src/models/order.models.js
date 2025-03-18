import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }  // Optionally store a human-readable address
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            default: "PENDING"
        },
        driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        station: { type: mongoose.Schema.Types.ObjectId, ref: "FuelStation", required: true },
        fuelType: { type: String, enum: ["petrol", "diesel", "gas"], required: true },
        quantity: { type: Number, required: true },
        totalCost: { type: Number, required: true },
        phone: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 15,
            match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
        },
        deliveryAddress: addressSchema,  // Optionally store both
        orderDate: { type: Date, default: Date.now }
    },
    { timestamps: true }
);


export const Order = mongoose.model("Order", orderSchema);
