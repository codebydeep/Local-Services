import { Router } from "express";

import { register, login, logout } from "../controllers/auth.controllers.js";

const authRoutes = Router()

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;