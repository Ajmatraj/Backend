import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,  // ✅ Fixed 'true:' to 'type:'
            ref: "User",
            required: true,
            index: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,  // ✅ Fixed 'true:' to 'type:'
            ref: "Order",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: "Rating must be an integer between 1 and 5"
            }
        },
        feedback: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Rating = mongoose.model("Rating", ratingSchema);
