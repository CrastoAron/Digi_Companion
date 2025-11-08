// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/digital_companion", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Basic test route
app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});

// Import routes (only if they exist)
try {
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/reminders", require("./routes/reminderRoutes"));
  app.use("/api/health", require("./routes/healthRoutes"));
} catch (err) {
  console.warn("⚠️ Some route files are missing:", err.message);
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
