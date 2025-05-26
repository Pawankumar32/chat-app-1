import jwt from 'jsonwebtoken';

/**
 * Function to generate a JWT token
 * @param {string} userId - The user ID to be included in the payload
 * @returns {string} - The generated JWT token
 */
export const generateToken = (userId) => {
    try {
        // Validate that the JWT_SECRET environment variable is defined
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Define token options
        const options = {
            expiresIn: '1h', // Token expires in 1 hour
            algorithm: 'HS256', // Use HS256 algorithm for signing
        };

        // Generate the token
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, options);
        
        return token;
    } catch (error) {
        console.error("Error generating JWT token:", error.message);
        throw new Error("Failed to generate token"); // Re-throw a generic error
    }
};