import { FuelStation } from "../models/fuelstation.models.js";
import { FuelType } from "../models/fueltype.models.js";  // Ensure the correct path
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { z } from "zod";
import { Types } from "mongoose";
import { User } from "../models/user.models.js";
import { Rating } from "../models/rating.models.js";

import mongoose from "mongoose";
const { ObjectId } = Types;  // Using ES module import for mongoose Types


// Updated Fuel Station Schema Validation
const fuelStationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    location: z.string().min(1, "Location is required"),
    imageurl: z.string().url("Invalid image URL").optional(),
    fuelTypes: z.array(
        z.object({
            fuelTypeName: z.string().min(1, "Fuel type name is required"),  // Assuming fuelTypeName is the name provided by the user
            price: z.number().min(0, "Price must be greater than or equal to 0"),
            quantity: z.number().min(0, "Quantity must be greater than or equal to 0"),
        })
    ).min(1, "At least one fuel type is required")
});


const registerFuelStation = asyncHandler(async (req, res, next) => {
    try {
        // Step 1: Validate request body using zod schema
        const parsedData = fuelStationSchema.parse(req.body);

        // Log the fuelTypes to check their structure
        console.log("Parsed fuelTypes data:", parsedData.fuelTypes);

        // Step 2: Check if the FuelStation already exists
        const existingFuelStation = await FuelStation.findOne({
            $or: [{ name: parsedData.name }, { email: parsedData.email }, { phone: parsedData.phone }],
        });
        if (existingFuelStation) {
            return next(new ApiError(400, "Fuel Station with this name, email, or phone already exists"));
        }

        // Step 3: Process FuelTypes
        const fuelTypesWithDetails = [];
        for (const fuelData of parsedData.fuelTypes) {
            // Ensure fuelTypeName exists and is a valid string
            if (!fuelData || typeof fuelData.fuelTypeName !== 'string') {
                return next(new ApiError(400, "Fuel type is required and must be a string"));
            }

            const fuelTypeName = fuelData.fuelTypeName.trim().toLowerCase(); // Ensure it’s properly sanitized

            // Find the fuel type in the database
            const fuelType = await FuelType.findOne({ name: fuelTypeName });

            if (!fuelType) {
                return next(new ApiError(404, `FuelType ${fuelData.fuelTypeName} not found`));
            }

            // Push fuelType details with price and quantity
            fuelTypesWithDetails.push({
                fuelType: fuelType._id,
                price: fuelData.price,
                quantity: fuelData.quantity,
            });
        }

        // Step 4: Ensure userId is present and assign it to the 'user' field
        const userId = req.body.userId;  // Getting userId from the body
        if (!userId) {
            return next(new ApiError(400, "UserId is required"));
        }

        // Validate that the userId exists in the User collection
        const userExists = await User.findById(userId);
        if (!userExists) {
            return next(new ApiError(404, "User not found"));
        }

        // Step 5: Create new FuelStation with userId assigned
        const newFuelStation = new FuelStation({
            ...parsedData,
            user: userId, // Ensure the userId is correctly assigned
            fuelTypes: fuelTypesWithDetails,
        });

        // Step 6: Save the FuelStation
        await newFuelStation.save();

        // Step 7: Populate fuelTypes with fuelTypeName (populate the fuelType reference)
        const populatedFuelStation = await FuelStation.findById(newFuelStation._id)
            .populate('fuelTypes.fuelType', 'name') // Populating fuelType's 'name'
            .exec();

        // Step 8: Send the success response with populated fuelTypes
        res.status(201).json(new ApiResponse("Fuel Station registered successfully", populatedFuelStation));
    } catch (error) {
        // Handle validation errors or other unexpected errors
        console.error("Error:", error); // Log the error for debugging
        return next(new ApiError(400, error.message || "Error registering Fuel Station"));
    }
});






// Get All Fuel Stations
const getAllFuelStations = asyncHandler(async (req, res, next) => {
    try {
        // Step 1: Get all fuel stations
        const fuelStations = await FuelStation.find()
            .populate("fuelTypes.fuelType", "name price") // Populate fuel types (optional)
            .exec();

        // Step 2: Handle case if no fuel stations are found
        if (!fuelStations || fuelStations.length === 0) {
            return next(new ApiError(404, "No fuel stations found"));
        }

         // Step 3: Return the list of all fuel stations
         res.status(200).json({
            statusCode: "All fuel stations retrieved",
            data: fuelStations,
            message: "Success",
            success: true,
        });
    } catch (error) {
        // Handle errors
        return next(new ApiError(400, error.message || "Error retrieving fuel stations"));
    }
});


//get fuel station by user id.
const getFuelStationByUserID = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate if 'id' is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid user ID format"));
        }

        // Find the fuel stations associated with the user ID
        const fuelStations = await FuelStation.find({ user: id })
            .exec();

        // Check if fuel stations are found
        if (!fuelStations || fuelStations.length === 0) {
            return next(new ApiError(404, "Fuel Station not found for this user"));
        }

        // Return the fuel stations if they exist
        res.status(200).json({
            data: fuelStations,  // Return the fuel station(s) for this user
            message: "Fuel Station(s) found",
            success: true
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error retrieving fuel station:", error);

        // Handle any errors during the process
        return next(new ApiError(500, error.message || "Error retrieving Fuel Station"));
    }
});

//get fuel station by its id
const getStationByID = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Step 1: Validate if id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`Invalid ID format: ${id}`); // Debugging log
            return next(new ApiError(400, "Invalid fuel station ID format"));
        }

        // Step 2: Find the fuel station by its ID
        console.log(`Searching for fuel station with ID: ${id}`); // Debugging log

        const fuelStation = await FuelStation.findById(id)
            .populate("fuelTypes.fuelType", "name price")  // Optionally populate fuel types with details like price and name
            .exec();

        // Step 3: Handle case if no fuel station is found
        if (!fuelStation) {
            console.log(`Fuel station not found for ID: ${id}`); // Debugging log
            return next(new ApiError(404, "Fuel station not found"));
        }

        // Step 4: Return the fuel station in the response
        res.status(200).json({
            data: fuelStation,
            message: "Fuel Station found",
            success: true
        });
    } catch (error) {
        // Log the error for debugging
        console.error("Error in getStationByID:", error);
        return next(new ApiError(400, error.message || "Error retrieving Fuel Station"));
    }
});




export {getStationByID, registerFuelStation, getAllFuelStations ,getFuelStationByUserID};
