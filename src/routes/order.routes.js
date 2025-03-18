import { Router } from "express";
import { placeOrder,getuserOrders,getFuelStationOrders } from "../controllers/order.controller.js"; 

const router = Router();

// Route for user registration
router.post("/", placeOrder);

//get orders placed by users.
router.get("/getuserOrders/:id", getuserOrders)

//  Get a'' fuel station orders
router.get("/getFuelStationOrders/:id", getFuelStationOrders);

export default router;
