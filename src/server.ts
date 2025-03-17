import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";

// Allow reading of .env files
dotenv.config();

// Connect to database
connectDB();

// Create express application
const app = express();

// Allows receiving data in JSON in req.body
app.use(express.json());

// Api routes
app.use("/api/projects", projectRoutes);

export default app;
