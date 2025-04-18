import dotenv from 'dotenv';
import connectDB from './db/index.js';
<<<<<<< HEAD
import { app, server } from './app.js';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Validate essential environment variables
if (!process.env.PORT || !process.env.SOCKET_PORT) {
    console.error("❌ Missing essential environment variables. Please check your .env file.");
    process.exit(1);
}

// Define ports with fallback defaults
const PORT = process.env.PORT || 8000;
const SOCKET_PORT = process.env.SOCKET_PORT || 8001;

// Connect to the database and start servers
connectDB()
    .then(() => {
        // Start API server
        app.listen(PORT, () => {
            console.log(`⚙️ API Server is running at port: ${PORT}`);
        });

        // Start Socket.IO server
        server.listen(SOCKET_PORT, () => {
            console.log(`🔌 Socket.IO Server is running at port: ${SOCKET_PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
=======
import app from './app.js';

dotenv.config({ path: './env' });

connectDB()
    .then(() => {
        // Ensuring app is an instance of Express
        if (app && typeof app.listen === 'function') {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
            });
        } else {
            console.log("Error: `app.listen` is not a function, check the app initialization.");
        }
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err);
>>>>>>> origin/ajmat
    });
