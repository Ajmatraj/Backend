import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index:true,
        },
        driver:{
            true: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index:true,
        },
        order:{
            true: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique:true,
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
        feedback:{
            type: String,
            trim:true,
        },
        date:{
            type:Date,
            default: Date.now
        },
    },
    {timestamps:true}
)

export const Rating = mongoose.model("Rating", ratingSchema)