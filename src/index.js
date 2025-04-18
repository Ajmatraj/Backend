import dotenv from 'dotenv';
import connectDB from './db/index.js';
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
    });
