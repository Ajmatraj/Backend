import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    videofile:{
        type:String,  // cloudinry url
        requried: true
    },
    thumbnail:{
        type:String,  // cloudinry url
        requried: true
    },
    title:{
        type:String, 
        requried: true
    },
    descripation: {
        type: String,
        requried: true
    },
    duration: {
        type: Number,
        requried: true
    },
    viewa:{
        type:Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)