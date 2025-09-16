import { Router } from "express";

import { register, login, logout } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = Router()

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/logout", authMiddleware, logout);

export default authRoutes;