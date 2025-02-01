import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Method for login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

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
    const accessToken = user.generateAccessToken();  // You can add expiry like `accessTokenExpiresIn: "15m"`
    const refreshToken = user.generateRefreshToken();  // You can add expiry like `refreshTokenExpiresIn: "7d"`

    // Optionally store refreshToken in the database for future invalidation
    // user.refreshToken = refreshToken;
    // await user.save();

    // Extract user role from the database
    const userRole = user.role;

    // Log the successful login event (for debugging, remove in production)
    if (process.env.NODE_ENV === "development") {
        console.log(`User logged in: ${user.username}, Role: ${userRole}`);
    }

    // Return the response with tokens and user role
    return res.status(200).json(
        new ApiResponse(200, { accessToken, refreshToken, role: userRole }, "User logged in successfully")
    );
});

export { loginUser };
