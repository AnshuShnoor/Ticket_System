
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pool = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");

    return res.status(200).json({
      status: "success",
      database: "connected",
      time: result.rows[0].server_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// Home route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Customer Support Ticket Management API is running!",
  });
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const messageRoutes = require("./routes/messageRoutes");
const activityRoutes = require("./routes/activityRoutes");

// Authentication routes
app.use("/api/auth", authRoutes);

// Ticket routes
app.use("/api/tickets", ticketRoutes);

// Message routes
app.use("/api/messages", messageRoutes);

// Activity routes
app.use("/api/activity", activityRoutes);

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  return res.status(404).json({
    message: "API endpoint not found.",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
