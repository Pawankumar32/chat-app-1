<<<<<<< HEAD
import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io"; // Import Socket.IO
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json({ limit: "4mb" })); // Limit request body size
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*", // Restrict origins in production
}));

// Routes setup

app.use("/api/status", (req, res) =>
    res.send("Server is live"));//simple format

//in json format
// app.use("/api/status", (req, res) => 
//     res.status(200).send({ message: "Server is live" }
// ));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to the database (MongoDB)
try {
    await connectDB();
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if the database connection fails
}

// Socket.IO setup
const userSocketMap = {}; // Map to track users and their associated socket IDs
const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN || "*" }, // Allow CORS for the specified origin
});

io.on("connection", (socket) => {
    console.log("New user connected");

    // Listen for userId from the client after connection
    socket.on("addUser", (userId) => {
        if (userId) {
            // Store userId on the socket for easy cleanup
            socket.userId = userId;

            // Map userId to the current socket ID
            if (!userSocketMap[userId]) {
                userSocketMap[userId] = [];
            }
            userSocketMap[userId].push(socket.id);
            console.log(`User ${userId} connected with socket ID ${socket.id}`);

            // Notify all clients about the updated online users
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`User ${socket.userId} disconnected`);

        // Remove the user from the map using the stored userId
        if (socket.userId) {
            userSocketMap[socket.userId] = userSocketMap[socket.userId].filter(
                (id) => id !== socket.id
            );

            // If no sockets remain for the user, delete the userId entry
            if (userSocketMap[socket.userId].length === 0) {
                delete userSocketMap[socket.userId];
            }

            // Notify all clients about the updated online users
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`)
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/api/status`)
}
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error.message);
    process.exit(1); // Exit the process to prevent undefined behavior
});

export { io, userSocketMap }; // Export io and userSocketMap for use in other modules
=======
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


const app = express();
const PORT = process.env.PORT || 5001;
connectDB();

const allowedOrigins=['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:allowedOrigins, credentials: true}));

//################# API End points #####################
app.get('/',(req,res)=> res.send('API is Working...'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
>>>>>>> 2a2e64e73ead8457fd9dd00ae2074bdcd60cc53a
