// Importing required modules
import express from 'express';
const app = express();

import cors from "cors"; // Cross-Origin Resource Sharing middleware
import cookieParser from "cookie-parser"; // Cookie parsing middleware

// CORS middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    credentials: true // Allow credentials (cookies, authorization headers)
}));

// Express configuration
app.use(express.json({ limit: "16kb" })); // Parsing incoming JSON requests (with a limit of 16kb)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parsing incoming URL-encoded requests (with a limit of 16kb)
app.use(express.static("public")); // Serving static files from the 'public' directory

// Cookie parsing middleware
app.use(cookieParser());

// Route imports
import userRouter from './routes/user.routes.js';
import FuelStationRouter from './routes/fuelStation.routes.js';
import FuelTypeRouter from './routes/fueltype.routes.js';
import orderRouter from './routes/order.routes.js';

// Routes declaration
app.use("/api/v1/users", userRouter); // Routes related to users
app.use('/api/v1/fuelstations', FuelStationRouter); // Routes related to fuel stations
app.use('/api/v1/fueltypes', FuelTypeRouter); // Routes related to fuel types
app.use('/api/v1/orders', orderRouter); // Routes related to fuel types

// Exporting the Express application instance
export default app;