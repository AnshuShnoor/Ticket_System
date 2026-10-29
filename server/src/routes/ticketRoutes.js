
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
  updateTicketStatus,
} = require("../controllers/ticketController");

// Customer creates a ticket
router.post(
  "/",
  authenticateToken,
  authorizeRole("customer"),
  createTicket
);

// Customer views their tickets
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

// Admin assigns a ticket
router.patch(
  "/:id/assign",
  authenticateToken,
  authorizeRole("admin"),
  assignTicket
);

// Agent updates the status of an assigned ticket
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
