import express from "express";
import dotenv from "dotenv";
import cors from "cors";

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
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

export default app;