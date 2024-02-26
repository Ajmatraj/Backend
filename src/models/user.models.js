import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type: String,
        requried: true,
        unique: true,
        lowecase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        requried: true,
        trim: true,
        index: true
    },
    fullName: {
        type: String,
        requried: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // cloudinary url
        requried:true
    },
    coverImage: { 
        type: String,  // cloudinary url
        requried:true
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        requried: [true, 'password is requried']
    },
    refreshToken: {
        type: String
    },

},{timestamps:true}
)

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function 
(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken= function () {
    Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.generateAccessToken,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRYT
        }
    )
}

userSchema.methods.generateRefreshToken= function () {
    Jwt.sign(
        {  
            _id: this._id,  
        },
        process.env.REFERSH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFERSH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)