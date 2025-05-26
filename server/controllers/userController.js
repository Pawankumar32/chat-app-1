<<<<<<< HEAD
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary"; // Import cloudinary for image uploads

// Signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        // Validate required fields
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        // Generate token
        const token = generateToken(newUser._id);
        res.status(201).json({ 
            success: true, 
            userData: { fullName: newUser.fullName, email: newUser.email, bio: newUser.bio }, 
            token, 
            message: "Account created successfully" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Controller to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and Password are required" });
        }

        // Find user
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(userData._id);
        res.status(200).json({ 
            success: true, 
            userData: { fullName: userData.fullName, email: userData.email, bio: userData.bio }, 
            token, 
            message: "Login successful" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Controller to check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        // Send only non-sensitive user data
        res.status(200).json({ 
            success: true, 
            user: { fullName: req.user.fullName, email: req.user.email, bio: req.user.bio } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic, bio } = req.body;

        // Get user ID from authenticated user
        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            // Update without profile picture
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            );
        } else {
            // Upload profile picture to cloudinary
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName, profilePic: upload.secure_url },
                { new: true }
            );
        }

        // Send updated user data
        res.status(200).json({ 
            success: true, 
            user: { fullName: updatedUser.fullName, email: updatedUser.email, bio: updatedUser.bio, profilePic: updatedUser.profilePic } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
=======
import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

>>>>>>> 2a2e64e73ead8457fd9dd00ae2074bdcd60cc53a
