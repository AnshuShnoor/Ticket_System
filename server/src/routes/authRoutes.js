
const express = require("express");
const { register, login } = require("../controllers/authcontroller");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user,
  });
});

router.get(
  "/admin-test",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

module.exports = router;
