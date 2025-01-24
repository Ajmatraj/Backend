import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { DB_NAME } from '../constants.js'

// Enum for user roles (you can expand this as per your need)
const userRole = {
    USER: "user",
    RIDER: "rider",
    FUELSTATION: "fuelstation"
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true, // Fixed typo
        unique: true,
        lowercase: true, // Fixed typo: 'lowecase' -> 'lowercase'
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true, // Fixed typo
        trim: true,
        index: true
    },
    name: {
        type: String,
        required: true, // Fixed typo
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // Cloudinary URL
    },
    password: {
        type: String,
        required: [true, 'Password is required'] // Fixed typo
    },
    refreshToken: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(userRole), // To set predefined roles
        default: userRole.USER // Default to USER role
    }

}, { timestamps: true });

// Hash password before saving if modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password correctness
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            avatar: this.avatar,
            name: this.name
        },
        process.env.JWT_SECRET, // Corrected environment variable name
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Corrected expiry variable name
        }
    );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET, // Corrected environment variable name
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Corrected expiry variable name
        }
    );
};


export const User = mongoose.model("User", userSchema);
