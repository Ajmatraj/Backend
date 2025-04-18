import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http';
import { Server } from 'socket.io';
import { socketMiddleware } from './middlewares/socketMiddleware.js';
import { socketHandler } from './socket/socket.js';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
});

// Attach io to request using middleware
app.use(socketMiddleware(io));

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
import FuelStationRouter from './routes/fuelStation.routes.js';
import FuelTypeRouter from './routes/fueltype.routes.js';
import orderRouter from './routes/order.routes.js';
import messageRouter from './routes/message.routes.js';

app.use("/api/v1/users", userRouter);
app.use('/api/v1/fuelstations', FuelStationRouter);
app.use('/api/v1/fueltypes', FuelTypeRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/messages', messageRouter);

// Plug in socket handler
socketHandler(io);

// Export app & server
export { app, server };
