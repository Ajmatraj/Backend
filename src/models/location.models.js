import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },
    { timestamps: true }
);

// Indexing latitude & longitude for better query performance
locationSchema.index({ latitude: 1, longitude: 1 });

export const Location = mongoose.model("Location", locationSchema);
