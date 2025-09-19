import { Router } from "express";
import checkAdmin from "../middlewares/admin.middleware.js";
import { addCategory, getAllCategories, removeCategory } from "../controllers/category.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const categoryRoutes = Router();

categoryRoutes.post("/add-category", authMiddleware, checkAdmin, addCategory);
categoryRoutes.delete("/delete-category/:id", authMiddleware, checkAdmin, removeCategory);
categoryRoutes.get("/get-all-categories", authMiddleware, checkAdmin, getAllCategories);

export default categoryRoutes;