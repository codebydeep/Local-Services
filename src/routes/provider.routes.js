import { Router } from "express";
import { getProviderProfile, createProviderProfile, addServiceProvider } from "../controllers/provider.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import checkAdmin from "../middlewares/admin.middleware.js";
import checkProvider from "../middlewares/provider.middleware.js";

const providerRoutes = Router();

providerRoutes.post("/add-service-provider/:id", authMiddleware, checkAdmin, addServiceProvider);
providerRoutes.get("/profile", authMiddleware, checkProvider, getProviderProfile);
providerRoutes.post("/create-profile", authMiddleware, checkProvider, createProviderProfile);

export default providerRoutes;