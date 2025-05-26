import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);

export default userRouter;
// This code defines a user router for handling user-related routes in an Express.js application.