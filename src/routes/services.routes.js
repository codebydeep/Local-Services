import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import checkProvider from "../middlewares/provider.middleware.js";
import { addAService } from "../controllers/services.controllers.js";

const serviceRoutes = Router();

serviceRoutes.post("/add-service", authMiddleware, checkProvider, addAService);

export default serviceRoutes;