import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Function to prepare user details
const getUserDetails = (user) => {
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
    };
};

// Method for login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    console.log(email,password)

    // Find the user by email (ensure email is in lowercase)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Check if user exists
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in DB (optional but recommended)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,        // Prevents client-side JS access
        secure: process.env.NODE_ENV === "production", // Only HTTPS in production
        sameSite: "Strict",    // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Get user details
    const userDetails = getUserDetails(user);

    // Send response with accessToken (but not refreshToken)
    return res.status(200).json(
        new ApiResponse(200, { accessToken, role: user.role , userDetails }, "User logged in successfully")
    );
});


export { loginUser };
