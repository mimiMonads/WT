import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
import messageRoutes from "./backend/routes/messageRoutes.mjs";
import userRoutes from "./backend/routes/userRoutes.mjs";
import dotenv from "dotenv";

const app = express();

// Load environment variables
const env = dotenv.config();;

// Middleware
app.use(json());
app.use(cors());

// Connect to MongoDB using .env variable
connect(env.parsed["process.env.MONGO_URI"])
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


// Mount Routers
app.use("/api/messages", messageRoutes);
app.use("/", userRoutes);

app.listen(3000, () => {
  console.log(`Server running on port ${3000}`);
}); 
