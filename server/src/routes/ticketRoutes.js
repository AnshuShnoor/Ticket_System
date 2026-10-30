
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
  createTicket,
  getMyTickets,
  getTickets,
  getTicketById,
  assignTicket,
  getAssignedTickets,
  getUnassignedTickets,
  getAgents,
  updateTicketStatus,
} = require("../controllers/ticketController");

// Customer creates a ticket
router.post(
  "/",
  authenticateToken,
  authorizeRole("customer"),
  createTicket
);

// All tickets visible to the logged-in user
router.get(
  "/",
  authenticateToken,
  getTickets
);

// Customer views their own tickets
router.get(
  "/my-tickets",
  authenticateToken,
  authorizeRole("customer"),
  getMyTickets
);

// Agent views assigned tickets
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

// Admin views all agents
router.get(
  "/agents",
  authenticateToken,
  authorizeRole("admin"),
  getAgents
);

// Admin assigns a ticket
router.patch(
  "/:id/assign",
  authenticateToken,
  authorizeRole("admin"),
  assignTicket
);

// Agent updates ticket status
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRole("agent"),
  updateTicketStatus
);

// Fetch a specific ticket
router.get(
  "/:id",
  authenticateToken,
  getTicketById
);

module.exports = router;
