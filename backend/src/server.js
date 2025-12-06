import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(
  "/api/inngest",
  serve({ client: inngest, functions, signingKey: ENV.CLERK_WEBHOOK_SECRET })
);

app.get("/hello", (req, res) => {
  res.status(200).json("Partha hello");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server running on port", ENV.PORT));
  } catch (error) {
    console.log(error);
  }
};

startServer();
