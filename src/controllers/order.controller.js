import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { FuelStation } from "../models/fuelstation.models.js";
import { z } from "zod";
import mongoose from "mongoose";

// Schema for order validation
const orderSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    fuelStationId: z.string().min(1, "Fuel station ID is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    quantity: z.number().positive("Quantity must be a positive number"),
    price: z.number().positive("Price must be a positive number"),
    totalCost: z.number().min(0, "Invalid price value"),
    paymentMethod: z.enum(["cash", "card", "online"], { message: "Invalid payment method" }),
    deliveryLocation: z.object({
        latitude: z.number().min(-90).max(90, "Invalid latitude value"),
        longitude: z.number().min(-180).max(180, "Invalid longitude value"),
    }),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
});



// Sample placeOrder function that uses the Order model
const placeOrder = asyncHandler(async (req, res, next) => {
    const { userId, fuelStationId, fuelType, quantity, totalCost, phone, deliveryAddress, status } = req.body;

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
        return next(new ApiError(404, "User not found"));
    }

    // Check if the fuel station exists
    const fuelStationExists = await FuelStation.findById(fuelStationId);
    if (!fuelStationExists) {
        return next(new ApiError(404, "Fuel station not found"));
    }

    // Create new order using the provided data
    const order = new Order({
        user: userId,
        station: fuelStationId,
        fuelType,
        quantity,
        totalCost,
        phone,
        deliveryAddress,
        status: status || "PENDING",  // Default to PENDING if no status is provided
    });

    // Save the order to the database
    await order.save();

    // Return the created order as a response
    res.status(201).json(new ApiResponse(201, order, "Order placed successfully!"));
});

//get all order details by user
const getuserOrders = asyncHandler(async (req, res, next) => {
    
    const { id } = req.params; // User ID from request params

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, "Invalid user ID format"));
    }

    // Check if the user exists
    const userExists = await User.findById(id);
    if (!userExists) {
        return next(new ApiError(404, "User not found"));
    }

    // Fetch all orders placed by this user, sorted by newest first
    const orders = await Order.find({ user: id })
        .populate("station", "name location") // Populate fuel station details
        .sort({ createdAt: -1 });

    if (!orders.length) {
        return res.status(404).json(new ApiResponse(404, [], "No orders found for this user"));
    }

    res.status(200).json(new ApiResponse(200, orders, "User orders fetched successfully"));
});


const getFuelStationOrders = asyncHandler(async (req, res, next) => {
    const { id } = req.params; // Fuel station ID from request params

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, "Invalid fuel station ID format"));
    }

    // Check if the fuel station exists
    const stationExists = await FuelStation.findById(id);
    if (!stationExists) {
        return next(new ApiError(404, "Fuel station not found"));
    }

    // Fetch all orders for this fuel station, sorted by newest first
    const orders = await Order.find({ station: id })
        .populate("user", "name email phone") // Populate user details
        .sort({ createdAt: -1 });

    if (!orders.length) {
        return res.status(404).json(new ApiResponse(404, [], "No orders found for this fuel station"));
    }

    res.status(200).json(new ApiResponse(200, orders, "Fuel station orders fetched successfully"));
});

// get order ddetsils by order id 
const getOrderByOrderId = asyncHandler(async (req, res, next) => {
    const { id } = req.params; // Order ID from request params

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, "Invalid order ID format"));
    }

    // Find the order by ID and populate related details
    const order = await Order.findById(id)
        .populate("user", "name email phone") // Populate user details
        .populate("station", "name location"); // Populate fuel station details

    if (!order) {
        return next(new ApiError(404, "Order not found"));
    }

    res.status(200).json(new ApiResponse(200, order, "Order details fetched successfully"));
});

// get all orders.
const getAllOrders = asyncHandler(async (req, res, next) => {
    // Fetch all orders, sorted by newest first
    const orders = await Order.find()
        .populate("user", "name email phone") // Populate user details
        .populate("station", "name location") // Populate fuel station details
        .sort({ createdAt: -1 });

    if (!orders.length) {
        return res.status(404).json(new ApiResponse(404, [], "No orders found"));
    }

    res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});


// update order status by order id.
const updateOrderStatus = asyncHandler(async (req, res, next) => {  
    const { id } = req.params; // Order ID from request params
    const { status } = req.body; // New status from request body

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, "Invalid order ID format"));
    }

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
        return next(new ApiError(404, "Order not found"));
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});

// delete order by order id
const deleteOrder = asyncHandler(async (req, res, next) => {  
    const { id } = req.params; // Order ID from request params

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, "Invalid order ID format"));
    }

    // Find and delete the order by ID
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
        return next(new ApiError(404, "Order not found"));
    }

    res.status(200).json(new ApiResponse(200, null, "Order deleted successfully"));
});

//cancel order by order id
// const cancelOrder = asyncHandler(async (req, res, next) => {  
//     const { id } = req.params; // Order ID from request params

//     // Validate if the provided ID is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return next(new ApiError(400, "Invalid order ID format"));
//     }

//     // Find the order by ID
//     const order = await Order.findById(id);
//     if (!order) {
//         return next(new ApiError(404, "Order not found"));
//     }

//     // Update the order status to CANCELLED
//     order.status = "CANCELLED";
//     await order.save();

//       // Only send necessary fields
//       const responseData = {
//         _id: order._id,
//         status: order.status,
//         updatedAt: order.updatedAt,
//     };

//     res.status(200).json(new ApiResponse(200, order, "Order cancelled successfully"));
// });

const cancelOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Debugging incoming ID
      console.log("Cancelling order with ID:", id);
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid order ID format");
        return next(new ApiError(400, "Invalid order ID format"));
      }
  
      const order = await Order.findById(id);
      if (!order) {
        console.error(" Order not found");
        return next(new ApiError(404, "Order not found"));
      }
  
      order.status = "CANCELLED";
      await order.save();
  
      // Debug updated status
      console.log(" Order cancelled:", { id: order._id, status: order.status });
  
      const responseData = {
        _id: order._id,
        status: order.status,
        updatedAt: order.updatedAt,
      };
  
      res.status(200).json(new ApiResponse(200, responseData, "Order cancelled successfully"));
    } catch (error) {
      console.error(" Error in cancelOrder:", error);
      return next(new ApiError(500, "Failed to cancel order"));
    }
  };
  


export { placeOrder, getuserOrders,getFuelStationOrders ,getOrderByOrderId, getAllOrders, updateOrderStatus,deleteOrder,cancelOrder};