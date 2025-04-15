import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app, server } from './app.js';

dotenv.config({ path: './env' });

const API_PORT = process.env.API_PORT || 8000;
const SOCKET_PORT = process.env.SOCKET_PORT || 8001;

connectDB()
    .then(() => {
        // Start API server
        app.listen(API_PORT, () => {
            console.log(`⚙️ API Server is running at port: ${API_PORT}`);
        });

        // Start Socket.IO server
        server.listen(SOCKET_PORT, () => {
            console.log(`🔌 Socket.IO Server is running at port: ${SOCKET_PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err);
    });
