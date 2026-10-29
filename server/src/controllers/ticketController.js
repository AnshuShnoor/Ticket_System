
const pool = require("../config/db");

const validPriorities = ["low", "medium", "high", "urgent"];
const validStatuses = ["open", "in progress", "resolved"];

// 1. Customer creates a ticket
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        message: "Subject, description and category are required.",
      });
    }

    const normalizedPriority =
      typeof priority === "string" ? priority.trim().toLowerCase() : "medium";

    if (!validPriorities.includes(normalizedPriority)) {
      return res.status(400).json({
        message: "Priority must be low, medium, high, or urgent.",
      });
    }

    const result = await pool.query(
      `INSERT INTO tickets
        (customer_id, subject, description, category, priority, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        req.user.id,
        subject.trim(),
        description.trim(),
        category.trim(),
        normalizedPriority,
        "open",
      ]
    );

    return res.status(201).json({
      message: "Ticket created successfully.",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error("Create ticket error:", error.message);
    return res.status(500).json({
      message: "Unable to create ticket.",
    });
  }
};

// 2. Customer views their own tickets
const getMyTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM tickets
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get my tickets error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch your tickets.",
    });
  }
};

// 3. Fetch one ticket with role-based access
const getTicketById = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        message: "Invalid ticket ID.",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM tickets
       WHERE id = $1`,
      [ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found.",
      });
    }

    const ticket = result.rows[0];
    const role = req.user.role;
    const userId = req.user.id;

    if (
      role === "customer" &&
      Number(ticket.customer_id) !== Number(userId)
    ) {
      return res.status(403).json({
        message: "You can only view your own tickets.",
      });
    }

    if (
      role === "agent" &&
      Number(ticket.assigned_agent_id) !== Number(userId)
    ) {
      return res.status(403).json({
        message: "This ticket is not assigned to you.",
      });
    }

    if (!["customer", "agent", "admin"].includes(role)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch ticket.",
    });
  }
};

// 4. Admin views unassigned tickets
const getUnassignedTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM tickets
       WHERE assigned_agent_id IS NULL
       ORDER BY created_at DESC`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get unassigned tickets error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch unassigned tickets.",
    });
  }
};

// 5. Agent views tickets assigned to them
const getAssignedTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM tickets
       WHERE assigned_agent_id = $1
       ORDER BY updated_at DESC`,
      [req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get assigned tickets error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch assigned tickets.",
    });
  }
};

// 6. Admin assigns a ticket to an agent
const assignTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { agentId } = req.body;

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        message: "Invalid ticket ID.",
      });
    }

    const parsedAgentId = Number(agentId);

    if (!Number.isInteger(parsedAgentId) || parsedAgentId <= 0) {
      return res.status(400).json({
        message: "A valid agentId is required.",
      });
    }

    const agentResult = await pool.query(
      `SELECT id
       FROM users
       WHERE id = $1 AND role = 'agent'`,
      [parsedAgentId]
    );

    if (agentResult.rows.length === 0) {
      return res.status(404).json({
        message: "Agent not found.",
      });
    }

    const result = await pool.query(
      `UPDATE tickets
       SET assigned_agent_id = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [parsedAgentId, ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found.",
      });
    }

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

// 7. Agent updates the status of their assigned ticket
const updateTicketStatus = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { status } = req.body ?? {};

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        message: "Invalid ticket ID.",
      });
    }

    if (
      typeof status !== "string" ||
      !validStatuses.includes(status.trim().toLowerCase())
    ) {
      return res.status(400).json({
        message: "Status must be open, in progress, or resolved.",
      });
    }

    const normalizedStatus = status.trim().toLowerCase();

    const result = await pool.query(
      `UPDATE tickets
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
         AND assigned_agent_id = $3
       RETURNING *`,
      [normalizedStatus, ticketId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found or not assigned to you.",
      });
    }

    return res.status(200).json({
      message: "Ticket status updated successfully.",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error("Update ticket status error:", error.message);
    return res.status(500).json({
      message: "Unable to update ticket status.",
    });
  }
};

// Export all controller functions
module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  assignTicket,
  getAssignedTickets,
  getUnassignedTickets,
  updateTicketStatus,
};
