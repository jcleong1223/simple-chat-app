import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoutes } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

/****** These are the protected routes, so we need to use the protectRoutes middleware to check it the user is authenticated, otherwise this route cannot be accessed ******/
router.put('/update-profile', protectRoutes, updateProfile);
router.get("/check", protectRoutes, checkAuth);

export default router;