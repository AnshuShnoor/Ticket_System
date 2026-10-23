
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const pool = require("./config/db");

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


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Customer Support Ticket Management API is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is working correctly",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use("/api/auth", authRoutes);