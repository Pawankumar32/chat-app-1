import express from "express";
import { 
    isAuthenticated, 
    login, 
    signup, 
    updateProfile 
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

/**
 * Route to sign up a new user
 * POST /api/users/signup
 * Expected body: { fullName, email, password, bio }
 */
userRouter.post("/signup", signup);

/**
 * Route to log in an existing user
 * POST /api/users/login
 * Expected body: { email, password }
 */
userRouter.post("/login", login);

/**
 * Route to update user profile details
 * PUT /api/users/update-profile
 * Requires authentication
 * Expected body: { fullName, profilePic, bio }
 */
userRouter.put("/update-profile", protectRoute, updateProfile);

/**
 * Route to check if the user is authenticated
 * GET /api/users/is-authenticated
 * Requires authentication
 */
userRouter.get("/is-authenticated", protectRoute, isAuthenticated);

export default userRouter;