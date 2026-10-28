
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const pool = require("./config/db");

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");

    res.json({
      status: "success",
      database: "connected",
      time: result.rows[0].server_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Customer Support Ticket Management API is running!",
  });
});

// Authentication routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Ticket routes
const ticketRoutes = require("./routes/ticketRoutes");
app.use("/api/tickets", ticketRoutes);

// Message routes
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
