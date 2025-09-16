import { Router } from "express";

import { register, login, logout, getProfile, changeCurrentPassword, verifyEmail } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = Router()

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/logout", authMiddleware, logout);
authRoutes.get("/get-me", authMiddleware, getProfile);
authRoutes.post("/change-current-password", authMiddleware, changeCurrentPassword);
authRoutes.get("/verify-email", verifyEmail);

export default authRoutes;