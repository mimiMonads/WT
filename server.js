const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const messageRoutes = require("./backend/routes/messageRoutes");
const userRoutes = require("./backend/routes/userRoutes");


const app = express();

// Load environment variables
const env = require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB using .env variable
mongoose
  .connect(env.parsed["process.env.MONGO_URI"])
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


// Mount Routers
app.use("/api/messages", messageRoutes);
app.use("/", userRoutes);

app.listen(3000, () => {
  console.log(`Server running on port ${3000}`);
}); 
