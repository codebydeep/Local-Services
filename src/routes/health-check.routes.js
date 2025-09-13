import healthCheck from "../controllers/health-check.controllers.js";

import { Router } from "express";

const healthCheckRoutes = Router();

healthCheckRoutes.get("/", healthCheck);

export default healthCheckRoutes;