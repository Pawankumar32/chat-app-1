import User from "../models/User.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes
 * Ensures the user is authenticated by verifying the JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided or invalid format",
            });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID and exclude the password field
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Attach the user to the request object for use in subsequent middleware or routes
        req.user = user;

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);

        // Handle token expiration or invalid token errors specifically
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again.",
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Authentication failed.",
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};