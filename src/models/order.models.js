import { compare } from "bcrypt";
import mongoose from "mongoose";
import { string } from "zod";


const orderItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity:{
        type:Number,
        required: true
    }
})


const addressSchema = new mongoose.Schema({
    latitude:{
        type: Number,
        required:true
    },
    longitude:{
        type: Number,
        required:true
    },
})

const orderSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        orderItems:{
            type: [orderItemSchema],
            default:[],
        },
        address:{
            type: String,
            required: true
        },
        status:{
            type: String,
            enum:["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            default: "PENDING"  
        },
        driver:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        station:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "FuelStation",
            required: true
        },
        fuelType:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "FuelType",
            required: true
        },
        quantity:{
            type: Number,
            required: true,
        },
        totalCost:{
            type: Number,
            required: true
        },
        deliveryAddress:{
            type: [addressSchema]
        },
        orderDate:{
            type: Date,
            default: Date.now
        },

    },
    {timestamps:true}
)

export const Order = mongoose.model("Order", orderSchema)