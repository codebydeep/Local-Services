import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import healthCheckRoutes from "./routes/health-check.routes.js";
import authRoutes from "./routes/auth.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import serviceRoutes from "./routes/services.routes.js";

dotenv.config({
    path: "./.env",
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    cors({
        origin: process.env.BASE_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
    })
);

app.use("/api/v1/health-check", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/providers", providerRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/services", serviceRoutes);

export default app;