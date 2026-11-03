
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pool = require("./config/db");

// Middleware
const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) =>
    origin.replace(/^https?:\/\//i, "").replace(/\/+$/, "").toLowerCase()
  );

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDevelopmentOrigin =
        process.env.NODE_ENV !== "production" &&
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
      const isConfiguredOrigin = configuredOrigins.includes(
        (origin || "")
          .replace(/^https?:\/\//i, "")
          .replace(/\/+$/, "")
          .toLowerCase()
      );

      if (!origin || isConfiguredOrigin || isLocalDevelopmentOrigin) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
