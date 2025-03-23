const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const messageRoutes = require("./backend/routes/messageRoutes");
const userRoutes = require("./backend/routes/userRoutes");


const app = express();

// Load environment variables
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB using .env variable
mongoose
  .connect(process.env.MONGO_URI) // Corrected to directly use process.env
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Mount Routers
app.use("/api/messages", messageRoutes);
app.use("/", userRoutes);

module.exports = app;
