import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.bold.blue.italic(`MongoDB connected on: ${url}\n`));
  } catch (error) {
    console.log(colors.bold.red.italic("Error connecting to MongoDB\n"));
    exit(1);
  }
};
