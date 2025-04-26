import express, { json } from "express";
import { connect } from "mongoose";
import messageRoutes from "./backend/routes/messageRoutes.mjs";
import userRoutes from "./backend/routes/userRoutes.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(json());
app.use(cookieParser());
app.use(cors({
  origin: process.env["FRONTEND"] ?? "https://www.tripleequal.dev",
  credentials: true,
}));

// Connect to MongoDB
connect(process.env["MONGO_URI"])
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(process.env);
    console.error("Error connecting to MongoDB:", err);
  });

// Mount Routers
app.use("/api/messages", messageRoutes);
app.use("/", userRoutes);

app.listen(5000, () => {
  console.log(`Server running on port ${5000}`);
});
