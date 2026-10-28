
const pool = require("../config/db");

const validPriorities = ["low", "medium", "high", "urgent"];

// Create a ticket
const createTicket = async (req, res) => {
  const { subject, description, category, priority = "medium" } = req.body ?? {};

  if (
    typeof subject !== "string" || !subject.trim() ||
    typeof description !== "string" || !description.trim() ||
    typeof category !== "string" || !category.trim()
  ) {
    return res.status(400).json({
      message: "Subject, description and category are required.",
    });
  }

  if (subject.trim().length > 200 || category.trim().length > 100) {
    return res.status(400).json({
      message: "Subject must be at most 200 characters and category at most 100 characters.",
    });
  }

  if (typeof priority !== "string" || !validPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Priority must be low, medium, high or urgent.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tickets
       (subject, description, category, priority, customer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, subject, description, category, priority, status,
                 created_at, updated_at`,
      [subject.trim(), description.trim(), category.trim(), priority, req.user.id]
    );

    return res.status(201).json({
      message: "Ticket created successfully.",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error("Create ticket error:", error.message);
    return res.status(500).json({ message: "Unable to create ticket." });
  }
};

// Get tickets belonging to the logged-in customer
const getMyTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, description, category, priority, status,
              created_at, updated_at
       FROM tickets
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      message: "Tickets fetched successfully.",
      tickets: result.rows,
    });
  } catch (error) {
    console.error("Get my tickets error:", error.message);
    return res.status(500).json({ message: "Unable to fetch tickets." });
  }
};

// Get a single ticket with role-based access
const getTicketById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const result = await pool.query(
      "SELECT * FROM tickets WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const ticket = result.rows[0];
    const role = req.user.role;
    const userId = Number(req.user.id);

    if (
      role === "customer" &&
      Number(ticket.customer_id) !== userId
    ) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    if (
      role === "agent" &&
      Number(ticket.assigned_agent_id) !== userId
    ) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    if (!["customer", "agent", "admin"].includes(role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.status(200).json({
      message: "Ticket fetched successfully.",
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error.message);
    return res.status(500).json({
      message: "Server error while fetching ticket.",
    });
  }
};

// Admin: Get tickets that have not been assigned
const getUnassignedTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, description, category, priority, status,
              customer_id, assigned_agent_id, created_at
       FROM tickets
       WHERE assigned_agent_id IS NULL
       ORDER BY created_at ASC`
    );

    return res.status(200).json({
      message: "Unassigned tickets fetched successfully.",
      tickets: result.rows,
    });
  } catch (error) {
    console.error("Get unassigned tickets error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch unassigned tickets.",
    });
  }
};

// Agent: Get tickets assigned to the logged-in agent
const getAssignedTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, description, category, priority, status,
              customer_id, assigned_agent_id, created_at, updated_at
       FROM tickets
       WHERE assigned_agent_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      message: "Assigned tickets fetched successfully.",
      tickets: result.rows,
    });
  } catch (error) {
    console.error("Get assigned tickets error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch assigned tickets.",
    });
  }
};

// Admin: Assign a ticket to a support agent
const assignTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { agentId } = req.body ?? {};

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    if (!Number.isInteger(Number(agentId)) || Number(agentId) <= 0) {
      return res.status(400).json({
        message: "A valid agentId is required.",
      });
    }

    const ticketResult = await pool.query(
      "SELECT id FROM tickets WHERE id = $1",
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Confirm the selected user is a support agent.
    const agentResult = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'agent'",
      [Number(agentId)]
    );

    if (agentResult.rows.length === 0) {
      return res.status(400).json({
        message: "The selected user is not a valid support agent.",
      });
    }

    const result = await pool.query(
      `UPDATE tickets
       SET assigned_agent_id = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, subject, status, customer_id,
                 assigned_agent_id, updated_at`,
      [Number(agentId), ticketId]
    );

    return res.status(200).json({
      message: "Ticket assigned successfully.",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error("Assign ticket error:", error.message);
    return res.status(500).json({
      message: "Unable to assign ticket.",
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  assignTicket,
  getAssignedTickets,
  getUnassignedTickets,
};
