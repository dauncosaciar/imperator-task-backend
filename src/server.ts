import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// Allow reading of .env files
dotenv.config();

// Connect to database
connectDB();

// Create express application
const app = express();

export default app;
