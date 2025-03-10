import { Router } from "express";
import { 
    registerFuelStation,
} from "../controllers/fuelStationController.js";  // Import necessary controller functions

const router = Router();

// Route for creating a new fuel station
router.post("/registerFuelStation", registerFuelStation);

export default router;
