// Importing required modules
import cors from "cors"; // Cross-Origin Resource Sharing middleware
import cookieParser from "cookie-parser"; // Cookie parsing middleware
import express from "express"; // Express.js framework

// Creating an Express application instance
const app = express();

// CORS middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    credentials: true // Allow credentials (cookies, authorization headers)
}));

// Express configuration
// Parsing incoming JSON requests (with a limit of 16kb)
app.use(express.json({ limit: "16kb" }));
// Parsing incoming URL-encoded requests (with a limit of 16kb)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Serving static files from the 'public' directory
app.use(express.static("public"));

// Cookie parsing middleware
app.use(cookieParser());

// Exporting the Express application instance
export { app };
