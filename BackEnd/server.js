// backend/server.js (Update this file)
require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- Route Definitions ---
// Import route modules
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const { protect } = require("./middleware/auth"); // Import the protect middleware

// Connect route modules to specific API endpoints
app.use("/api/auth", authRoutes); // Authentication routes (e.g., /api/auth/register, /api/auth/login)

// Apply 'protect' middleware to transaction and category routes
// This means these routes will now require a valid JWT to access
app.use("/api/transactions", protect, transactionRoutes);
app.use("/api/categories", protect, categoryRoutes);

// Basic route for root URL
app.get("/", (req, res) => {
  res.send("Account Book API is running!");
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
