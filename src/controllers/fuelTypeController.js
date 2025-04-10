import { FuelType } from "../models/fueltype.models.js";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";

// Fuel Type Validation Schema using Zod
const fuelTypeSchema = z.object({
    name: z.string().min(1, "Fuel type name is required").trim(),
    price: z.number().min(0, "Price must be a non-negative number"), // Ensure price is a number
    quantity: z.number().min(0, "Quantity must be a non-negative number") // ✅ Added quantity
});

// Create a new fuel type with Zod Validation and Error Handling
const createFuelType = asyncHandler(async (req, res, next) => {
    try {
        // Validate input data using Zod schema
        const validatedData = fuelTypeSchema.parse(req.body);

        // Check if a fuel type with the same name already exists
        const existingFuelType = await FuelType.findOne({ name: validatedData.name });
        if (existingFuelType) {
            return next(new ApiError(400, "Fuel type already exists"));
        }

        // Create a new FuelType instance
        const newFuelType = new FuelType(validatedData);
        await newFuelType.save();

        res.status(201).json(new ApiResponse(201, newFuelType, "FuelType created successfully"));
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(new ApiResponse(400, error.errors, "Validation failed"));
        }
        next(error);
    }
});

// Get all fuel types
const getAllFuelTypes = asyncHandler(async (req, res, next) => {
    try {
        const fuelTypes = await FuelType.find();
        res.status(200).json({ message: "Fuel types fetched successfully", data: fuelTypes });
    } catch (error) {
        next(error);
    }
});

// Get a fuel type by ID
const getFuelTypeById = asyncHandler(async (req, res, next) => {
    try {
        const fuelType = await FuelType.findById(req.params.id);
        if (!fuelType) {
            return res.status(404).json({ message: "FuelType not found" });
        }
        res.status(200).json({ message: "FuelType fetched successfully", data: fuelType });
    } catch (error) {
        next(error);
    }
});

// Update a fuel type by ID with Zod Validation
const updatedFuelType = asyncHandler(async (req, res, next) => {
    try {
        // Validate input data using Zod schema
        const validatedData = fuelTypeSchema.parse(req.body); // Validate the incoming data

        // Find and update the fuel type by ID
        const updatedFuelType = await FuelType.findByIdAndUpdate(
            req.params.id,
            validatedData, // Use validated data to update the document
            { new: true, runValidators: true } // Ensure validations are applied
        );

        // Check if fuel type was found and updated
        if (!updatedFuelType) {
            return res.status(404).json({ message: "FuelType not found" });
        }

        // Send the updated fuel type in the response
        res.status(200).json({ message: "FuelType updated successfully", data: updatedFuelType });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // If validation error occurs, return 400 with specific field errors
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors, // Return the validation errors
            });
        }
        // If any other error, pass it to the global error handler
        next(error);
    }
});

// Export the functions for use in routes
    export { createFuelType, getAllFuelTypes, getFuelTypeById, updatedFuelType };
