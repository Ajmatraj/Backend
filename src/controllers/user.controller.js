import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { z } from "zod";

// Method for register

// Schema for user registration validation
const registerSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(4, "Username must be at least 4 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    avatar: z.instanceof(Object).optional(), // Optional avatar field
});

const registerUser = asyncHandler(async (req, res) => {
    // Validate user details from the frontend
    let validated;
    try {
        validated = registerSchema.parse(req.body);
        const { name, email, username, password } = validated;
    console.log(name, email, username, password);

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists!");
    }

    // Check if avatar is present and upload to Cloudinary
    let avatarUrl = '';
    if (req.files?.avatar) {
        const avatarLocalPath = req.files.avatar.tempFilePath || req.files.avatar[0]?.path; // Depending on file upload method
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (avatar) {
            avatarUrl = avatar.url;
        }
    }

    // Create user object - create entry in DB
    const user = await User.create({
        name,
        avatar: avatarUrl,
        email,
        password,
        username: username.toLowerCase(),
    });

    // Remove password and refreshToken fields from the response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong, User is not registered");
    }

    // Return response
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Send validation errors in the response
            return res.status(400).json({
                status: 400,
                message: "Validation failed",
                errors: error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            });
        }
        throw error; // Re-throw unexpected errors
    }

    
});

export { registerUser };
