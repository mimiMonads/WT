const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB using .env variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Mount Routers
app.use("/api/messages", messageRoutes);
app.use("/", userRoutes);

// Use PORT from .env or fallback
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
