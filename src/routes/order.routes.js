import { Router } from "express";
import { placeOrder,getuserOrders,getFuelStationOrders ,getOrderByOrderId, getAllOrders, updateOrderStatus} from "../controllers/order.controller.js"; 

const router = Router();

// Route for user registration
router.post("/", placeOrder);

//get orders placed by users.
router.get("/getuserOrders/:id", getuserOrders)

//  Get a'' fuel station orders
router.get("/getFuelStationOrders/:id", getFuelStationOrders);

// get order ddetsils by order id 
router.get("/getOrderByOrderId/:id", getOrderByOrderId)

//get all order.
router.get("/getAllOrders",getAllOrders );

// update order status by order id
router.put("/updateOrderStatus/:id", updateOrderStatus);

export default router;
