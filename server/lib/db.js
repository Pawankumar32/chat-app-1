import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async () => {
    try {
        // Listen for successful connection
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        // Listen for errors after connection
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        // Listen for disconnection
        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });

        // Connect to MongoDB database
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not set in environment variables");
        }

        await mongoose.connect(`${uri}/chat-app`);
        
        console.log("Database connection established");

    } catch (error) {
        // Log and rethrow the error
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
};