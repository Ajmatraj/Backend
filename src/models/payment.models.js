import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        order:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            unique:true,
            required: true,
            index:true,
        },
        amount:{
            type: Number,
            required:true,
            min:0,
        },
        method:{
            type: String,
            enum: ["CASH", "ONLINE"], // Restrict payment methods
            required: true
        },
        status:{
            type:String,
            enum:["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING"
        },
        paymentDate:{
            type: Date,
            default: Date.now
        }
    },
    {timestamps:true}
)

export const Payment = mongoose.model("Payment", paymentSchema);