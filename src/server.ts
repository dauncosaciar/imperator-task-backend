import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import projectRoutes from "./routes/projectRoutes";

// Allow reading of .env files
dotenv.config();

// Connect to database
connectDB();

// Create express application
const app = express();

// Enable CORS
app.use(cors(corsConfig));

// Logging
app.use(morgan("dev"));

// Allows receiving data in JSON in req.body
app.use(express.json());

// Api routes
app.use("/api/projects", projectRoutes);

export default app;
