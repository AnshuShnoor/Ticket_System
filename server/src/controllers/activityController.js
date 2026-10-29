
const pool = require("../config/db");

const getTicketActivity = async (req, res) => {
  try {
    const ticketId = Number(req.params.ticketId);

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        message: "Invalid ticket ID.",
      });
    }

    // Verify ticket exists and user has access
    const ticketResult = await pool.query(
      `SELECT id, customer_id, assigned_agent_id
       FROM tickets
       WHERE id = $1`,
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found.",
      });
    }

    const ticket = ticketResult.rows[0];
    const role = req.user.role;
    const userId = Number(req.user.id);

    const isCustomer =
      role === "customer" &&
      Number(ticket.customer_id) === userId;

    const isAssignedAgent =
      role === "agent" &&
      Number(ticket.assigned_agent_id) === userId;

    const isAdmin = role === "admin";

    if (!isCustomer && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({
        message: "You cannot view this ticket's activity.",
      });
    }

    const result = await pool.query(
      `SELECT
         a.id,
         a.ticket_id,
         a.user_id,
         u.name AS user_name,
         a.action,
         a.details,
         a.created_at
       FROM ticket_activity a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.ticket_id = $1
       ORDER BY a.created_at DESC`,
      [ticketId]
    );

    return res.status(200).json({
      activities: result.rows,
    });
  } catch (error) {
    console.error("Get ticket activity error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch ticket activity.",
    });
  }
};

module.exports = { getTicketActivity };
