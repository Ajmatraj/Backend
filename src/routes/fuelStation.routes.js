import { Router } from "express";
import { 
    registerFuelStation,
    getAllFuelStations,
    getFuelStationByUserID,
    getStationByID,
    deletelFuelStatinById,
} from "../controllers/fuelStationController.js";  // Import necessary controller functions

const router = Router();

// Route for creating a new fuel station
router.post("/registerFuelStation", registerFuelStation);

// Route for getting all fuel stations
router.get("/getAllFuelStations", getAllFuelStations);


router.get("/stationbyid/:id", getStationByID);

//get fuel statioin by userid.
router.get("/:id", getFuelStationByUserID);

// delete fuel station by id.
router.delete("/deletelFuelStatinById/:id", deletelFuelStatinById)

export default router;
