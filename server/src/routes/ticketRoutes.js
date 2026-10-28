
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
  createTicket,
  getMyTickets,
  getTicketById,
  assignTicket,
  getAssignedTickets,
  getUnassignedTickets,
} = require("../controllers/ticketController");

// Customer creates a ticket
router.post(
  "/",
  authenticateToken,
  authorizeRole("customer"),
  createTicket
);

// Customer views their own tickets
router.get(
  "/my-tickets",
  authenticateToken,
  authorizeRole("customer"),
  getMyTickets
);

// Agent views tickets assigned to them
router.get(
  "/assigned",
  authenticateToken,
  authorizeRole("agent"),
  getAssignedTickets
);

// Admin views unassigned tickets
router.get(
  "/unassigned",
  authenticateToken,
  authorizeRole("admin"),
  getUnassignedTickets
);

// Admin assigns a ticket to an agent
router.patch(
  "/:id/assign",
  authenticateToken,
  authorizeRole("admin"),
  assignTicket
);

// Fetch a specific ticket
router.get(
  "/:id",
  authenticateToken,
  getTicketById
);

module.exports = router;
