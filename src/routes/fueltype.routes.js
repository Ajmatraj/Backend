import { Router } from "express";
import { 
    createFuelType, 
    getAllFuelTypes,    // Added function for getting all fuel types
    getFuelTypeById,    // Added function for getting fuel type by ID
    updatedFuelType      // Added function for updating fuel type by ID
} from "../controllers/fuelTypeController.js";  // Import necessary controller functions

const router = Router();

// Route for creating a new fuel type
router.post("/createFuelType", createFuelType); // Updated to be consistent with other routes

// Route for getting all fuel types
router.get("/FuelTypes", getAllFuelTypes); // Endpoint for getting all fuel types

// Route for getting a fuel type by ID
router.get("/FuelTypes:id", getFuelTypeById); // Endpoint for getting fuel type by ID

// Route for updating a fuel type by ID
router.put("/FuelTypes:id", updatedFuelType); // Endpoint for updating a fuel type by ID

export default router;
