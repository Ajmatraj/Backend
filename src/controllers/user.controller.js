import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { z } from "zod";
import { Order } from "../models/order.models.js";
import mongoose from "mongoose";

import { Rating } from "../models/rating.models.js";

// Method for register

// Schema for user registration validation
const registerSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(4, "Username must be at least 4 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.string(),
    avatar: z.instanceof(Object).refine((val) => {
        return val ? val.mimetype.startsWith("image/") : true;
    }, {
        message: "Avatar must be an image file",
    }).optional(),
});

const registerUser = asyncHandler(async (req, res) => {
    // Validate user details from the frontend
    let validated;
    try {
        validated = registerSchema.parse(req.body);
        const { name, email,role, username, password } = validated;
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
            role,
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


// Method to get user details by ID
const getUserDetailsById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        // Fetch the user from the database along with the related information
        const user = await User.findById(id)
            .select("-password -refreshToken")  // Exclude sensitive fields
            .populate("orders")  // Populate the orders for the user
            .populate("ratingGiven")  // Populate the ratings given by the user
            .populate("ratingReceived")  // Populate the ratings received by the user
            .populate("location")  // Populate the user's location
            .populate({
                path: "FuelStation",  // Populate fuel station details
                populate: {
                    path: "fuelTypes.fuelType",  // Populate the fuel types related to the fuel station
                    select: "name price"  // You can specify which fields of the fuelType to include
                }
            })
            .exec();
            console.log(user); // Check if the fuelStation field contains a valid ObjectId


        // If no user is found, return a 404 error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user details along with fuel station details
        res.status(200).json(new ApiResponse(200, user, "User details retrieved successfully"));
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getAllUsersfilters = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role, status, search, email, location } = req.query;
    const filter = {};

    // Apply optional role filter
    if (role && Object.values(userRole).includes(role.toLowerCase())) {
        filter.role = role.toLowerCase();
    }

    // Apply optional status filter
    if (status && ["Active", "inActive"].includes(status)) {
        filter.status = status;
    }

    // Apply optional search filter (by name, username, or email)
    if (search) {
        filter.$or = [
            { name: new RegExp(search, "i") },
            { username: new RegExp(search, "i") },
            { email: new RegExp(search, "i") }
        ];
    }

    // Apply optional email filter
    if (email) {
        filter.email = new RegExp(email, "i"); // Case-insensitive search for email
    }

    // Apply optional location filter
    if (location) {
        filter.location = { $in: location.split(",") }; // Assuming locations are passed as comma-separated values
    }

    // Pagination and retrieval
    const users = await User.find(filter)
        .select("-password -refreshToken") // Exclude sensitive fields
        .populate("orders ratingGiven ratingRecived location station") // Ensure these references are populated
        .skip((page - 1) * limit)
        .limit(Number(limit));

    if (!users.length) {
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});


// Method to get all users without any filters or pagination
const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all users, excluding sensitive fields like password and refreshToken
    const users = await User.find().select("-password -refreshToken");

    // If no users are found, throw an error
    if (!users.length) {
        throw new ApiError(404, "No users found");
    }

    // Return a success response with the fetched users
    return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});


// Update user details
const updateUserDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, username, role } = req.body;
  
      console.log('Received user update request:', { id, name, email, username });
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid user ID format:', id);
        return res.status(400).json({ error: 'Invalid user ID format' });
      }
  
      const formattedUsername = username ? username.toLowerCase() : undefined;
      const formattedEmail = email ? email.toLowerCase() : undefined;
  
      // Check if username or email already exists for other users
      const existingUser = await User.findOne({
        $or: [{ username: formattedUsername }, { email: formattedEmail }],
        _id: { $ne: id },
      });
  
      if (existingUser) {
        console.log('Username or email already in use:', { formattedUsername, formattedEmail });
        return res.status(400).json({ error: 'Username or email already in use' });
      }
  
      let avatarUrl = undefined;
      console.log(req.files?.avatar)
      if (req.files?.avatar) {
        const avatarLocalPath = req.files.avatar.tempFilePath || req.files.avatar[0]?.path;
        const uploadResult = await uploadOnCloudinary(avatarLocalPath);
  
        if (uploadResult) {
          avatarUrl = uploadResult.url;
          console.log(avatarUrl)
          console.log(uploadResult.secure_url);
        }
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name: name || undefined,
          email: formattedEmail || undefined,
          username: formattedUsername || undefined,
          role: role || undefined,
          avatar: avatarUrl || undefined,
        },
        { new: true }
      ).select("-password -refreshToken");
  
      if (!updatedUser) {
        console.log('User not found:', id);
        return res.status(404).json({ error: 'User not found' });
      }
  
      console.log('User details updated successfully:', updatedUser);
      return res.status(200).json({
        message: 'User details updated successfully',
        data: updatedUser,
      });
  
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
// detel user by user id.
const deleteUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid user ID format:', id);
        return res.status(400).json({ error: 'Invalid user ID format' });
      }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    // If user not found, return error
    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});



export {updateUserDetails, registerUser, getUserDetailsById, getAllUsersfilters ,getAllUsers, deleteUserById};
