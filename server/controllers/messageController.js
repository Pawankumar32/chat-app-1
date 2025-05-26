import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/Cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users for the left sidebar
export const getUsersForLeftSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        // Exclude the current user and select all fields except the password
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // Object to store the count of unread messages
        const unreadMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });

            // If unread messages exist, add them to the count
            if (messages.length > 0) {
                unreadMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);

        res.json({ success: true, users: filteredUsers, unreadMessages });
    } catch (error) {
        console.error(error.message); // Use console.error for better error logging
        res.status(500).json({ success: false, message: error.message }); // Send appropriate HTTP status code
    }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
    try {
        const { selectedUserId } = req.params; // Fix: 'id' is not needed here, only 'selectedUserId'
        const myId = req.user._id;

        // Corrected the query: 'receiverId' was undefined, replaced with 'selectedUserId'
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });

        // Mark messages as seen
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error.message); // Use console.error for better error logging
        res.status(500).json({ success: false, message: error.message }); // Send appropriate HTTP status code
    }
};

// API to mark a message as seen using its ID
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the message exists before updating
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.error(error.message); // Use console.error for better error logging
        res.status(500).json({ success: false, message: error.message }); // Send appropriate HTTP status code
    }
};

// Send a new message to the selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params._id;
        const senderId = req.user._id;

        let imageUrl = "";
        if (image) {
            // Upload the image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create a new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });
    } catch (error) {
        console.error(error.message); // Use console.error for better error logging
        res.status(500).json({ success: false, message: error.message }); // Send appropriate HTTP status code
    }
};