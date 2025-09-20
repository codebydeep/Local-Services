import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import checkProvider from "../middlewares/provider.middleware.js";
import { addAService, deleteService, getService, updateService } from "../controllers/services.controllers.js";
import checkAdmin from "../middlewares/admin.middleware.js";

const serviceRoutes = Router();

serviceRoutes.post("/add-service", authMiddleware, checkProvider, addAService);
serviceRoutes.get("/service/:id", authMiddleware, getService);
serviceRoutes.patch("/update-service/:id", authMiddleware, checkProvider, updateService);
serviceRoutes.delete("/delete-service/:id", authMiddleware, checkProvider, deleteService);

export default serviceRoutes;