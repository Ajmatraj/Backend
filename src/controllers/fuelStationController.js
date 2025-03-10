import { FuelStation } from "../models/fuelstation.models.js";
import { FuelType } from "../models/fueltype.models.js";  // Ensure the correct path
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { z } from "zod";
import mongoose from "mongoose";

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


// Register Fuel Station with Multiple Fuel Types
const registerFuelStation = asyncHandler(async (req, res, next) => {
    try {
        // Step 1: Validate request body using zod schema
        const parsedData = fuelStationSchema.parse(req.body);

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
            const fuelType = await FuelType.findOne({ name: fuelData.fuelTypeName.toLowerCase() });

            if (!fuelType) {
                return next(new ApiError(404, `FuelType ${fuelData.fuelTypeName} not found`));
            }

            // Push the fuelType details to the array with price and quantity
            fuelTypesWithDetails.push({
                fuelType: fuelType._id,
                price: fuelData.price,
                quantity: fuelData.quantity,
            });
        }

        // Step 4: Ensure userId is present and assign it to the 'user' field
        //get user id form local storage?
        const userId = req.body.userId;  // Getting userId from the body
        if (!userId) {
            return next(new ApiError(400, "UserId is required"));
        }

        // Step 5: Create new FuelStation with userId assigned
        const newFuelStation = new FuelStation({
            ...parsedData,
            user: userId, // Ensure the userId is correctly assigned
            fuelTypes: fuelTypesWithDetails,
        });

        // Step 6: Save the FuelStation
        await newFuelStation.save();

        // Step 7: Send the success response
        res.status(201).json(new ApiResponse("Fuel Station registered successfully", newFuelStation));
    } catch (error) {
        // Handle validation errors or other unexpected errors
        return next(new ApiError(400, error.message || "Error registering Fuel Station"));
    }
});


export { registerFuelStation };

