const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
  createTicket,
  getMyTickets,
  getTicketById,
} = require("../controllers/ticketController");

router.post(
  "/",
  authenticateToken,
  authorizeRole("customer"),
  createTicket
);

router.get(
  "/my-tickets",
  authenticateToken,
  authorizeRole("customer"),
  getMyTickets
);
router.get(
  "/:id",
  authenticateToken,
  getTicketById
);
module.exports = router;