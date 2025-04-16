import express, { json } from "express";
import { connect } from "mongoose";
import messageRoutes from "./backend/routes/messageRoutes.mjs";
import userRoutes from "./backend/routes/userRoutes.mjs";
import dotenv from "dotenv";

const app = express();

const env = dotenv.config();;

// Middleware
app.use(json());

// Connect to MongoDB using .env variable
connect(env.parsed["process.env.MONGO_URI"])
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


// Mount Routers
app.use("/api/messages", messageRoutes);
app.use("/", userRoutes);


app.listen(5000, () => {
  console.log(`Server running on port ${5000}`);
}); 