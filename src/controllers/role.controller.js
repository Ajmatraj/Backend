import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js"; // Import the User model
import { ApiResponse } from "../utils/ApiResponse.js";

// Method for assigning the role
const assigningRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const { id } = req.params; // User ID from the route parameter

    // Validate the role
    if (!role || !['user', 'fuelstation'].includes(role)) {
        throw new ApiError(400, "Invalid role"); // Error for invalid role
    }

    // Find the user by ID
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Assign the new role to the user
    user.role = role;
    await user.save();

    // Return the updated user details
    return res.status(200).json(
        new ApiResponse(200, { userId: user._id, role: user.role }, "Role updated successfully")
    );
});

export { assigningRole };
