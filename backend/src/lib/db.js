import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB url doesn't exist in the environment variable.");
    }
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("DB connected successfully", conn.connection.host);
  } catch (error) {
    console.log("Error happens", error);
  }
};
