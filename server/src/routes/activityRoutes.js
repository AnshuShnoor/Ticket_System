
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const { getTicketActivity } = require("../controllers/activityController");

router.get(
  "/:ticketId",
  authenticateToken,
  getTicketActivity
);

module.exports = router;
