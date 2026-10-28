
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getTicketMessages,
  sendMessage,
} = require("../controllers/messageController");

// Fetch messages for a ticket
router.get(
  "/:ticketId",
  authenticateToken,
  getTicketMessages
);

// Send a message to a ticket
router.post(
  "/:ticketId",
  authenticateToken,
  sendMessage
);

module.exports = router;
