import mongoose from "mongoose";

const FuelTypeSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            lowercase: true,
            unique:true,
            trim:true,
        },
        price:{
            type: Number,
            required:true,
            min:0,
        },
        qunitity:{
            type:Number,
            required:true,
            min:0,
        }
       
    }
    ,{timestamps:true})

export const FuelType = mongoose.model("FuelType", FuelTypeSchema)