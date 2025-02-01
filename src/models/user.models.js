import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { DB_NAME } from '../constants.js';

// Enum for user roles
const userRole = {
    USER: "user",
    RIDER: "rider",
    FUELSTATION: "fuelstation"
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Email format validation
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // Cloudinary URL
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(userRole), // Predefined roles
        default: userRole.USER // Default to USER role
    }

}, { timestamps: true });

// Hash password before saving if modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
});

// Method to check password correctness
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            avatar: this.avatar,
            name: this.name
        },
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' // Default expiry of 1 hour
        }
    );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
    }

    return Jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' // Default expiry of 7 days
        }
    );
};

export const User = mongoose.model("User", userSchema);
