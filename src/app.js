import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import healthCheckRoutes from "./routes/health-check.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config({
    path: "./.env",
});

const app = express();

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

export default app;