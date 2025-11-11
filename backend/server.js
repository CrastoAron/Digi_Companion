// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Prefer env var names in this order:
// 1) MONGO_URL (from your first file), 2) MONGO_URI (from your second file), 3) local fallback
const MONGO =
  process.env.MONGO_URL ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/digital_companion";

// MongoDB connection
mongoose
  .connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Basic test route
app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});

// Register routes that definitely exist (authRoutes was explicitly used in the first file)
try {
  // Explicitly require and mount auth routes (mirrors first file behavior)
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);
} catch (err) {
  console.warn("⚠️ authRoutes file missing or failed to load:", err.message);
}

// Import other routes if they exist (keeps the try/catch approach from the second file)
try {
  app.use("/api/reminders", require("./routes/reminderRoutes"));
} catch (err) {
  console.warn("⚠️ reminderRoutes file missing or failed to load:", err.message);
}

try {
  app.use("/api/health", require("./routes/healthRoutes"));
} catch (err) {
  console.warn("⚠️ healthRoutes file missing or failed to load:", err.message);
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
