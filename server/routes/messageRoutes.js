import express from "express";
import {
    getMessages,
    getUsersForLeftSidebar,
    markMessageAsSeen,
    sendMessage,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";
import { io, userSocketMap } from "../server.js"; // Import io and userSocketMap from the merged server.js file

const messageRouter = express.Router();

// Apply protectRoute middleware to all routes in the router
messageRouter.use(protectRoute);

/**
 * Route to get users for the left sidebar
 * GET /api/messages/users
 */
messageRouter.get("/users", getUsersForLeftSidebar);

/**
 * Route to get messages between the authenticated user and another user
 * GET /api/messages/:id
 * @param {string} id - The ID of the user to fetch messages with
 */
messageRouter.get("/:id", getMessages);

/**
 * Route to mark a message as seen
 * PUT /api/messages/mark/:id
 * @param {string} id - The ID of the message to mark as seen
 */
messageRouter.put("/mark/:id", markMessageAsSeen);

/**
 * Route to send a message
 * POST /api/messages/send/:id
 * @param {string} id - The ID of the user to send the message to
 */
messageRouter.post("/send/:id", (req, res, next) => {
    const { id } = req.params; // ID of the recipient
    const { content } = req.body; // Message content sent by the client

    // Send message logic handled in the controller
    sendMessage(req, res, next);

    // Emit the message to the recipient if they are online
    if (userSocketMap[id]) {
        userSocketMap[id].forEach(socketId => {
            io.to(socketId).emit("newMessage", {
                senderId: req.user.id, // ID of the authenticated user sending the message
                content, // The message content
            });
        });
    }
});

export default messageRouter;