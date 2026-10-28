
const pool = require("../config/db");

// Get messages for a ticket
const getTicketMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    if (!Number.isInteger(Number(ticketId)) || Number(ticketId) <= 0) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticketResult = await pool.query(
      "SELECT id, customer_id FROM tickets WHERE id = $1",
      [Number(ticketId)]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticket = ticketResult.rows[0];

    if (role === "customer" &&
        Number(ticket.customer_id) !== Number(userId)) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!["customer", "agent", "admin"].includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `SELECT id, ticket_id, sender_id, message, created_at
       FROM messages
       WHERE ticket_id = $1
       ORDER BY created_at ASC`,
      [Number(ticketId)]
    );

    return res.status(200).json({
      message: "Messages fetched successfully",
      messages: result.rows,
    });
  } catch (error) {
    console.error("Get ticket messages error:", error);
    return res.status(500).json({
      message: "Server error while fetching messages",
    });
  }
};

// Send a message to a ticket
const sendMessage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const { message } = req.body;

    if (!Number.isInteger(Number(ticketId)) || Number(ticketId) <= 0) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const ticketResult = await pool.query(
      "SELECT id, customer_id FROM tickets WHERE id = $1",
      [Number(ticketId)]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticket = ticketResult.rows[0];

    if (role === "customer" &&
        Number(ticket.customer_id) !== Number(userId)) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!["customer", "agent", "admin"].includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `INSERT INTO messages (ticket_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING id, ticket_id, sender_id, message, created_at`,
      [Number(ticketId), userId, message.trim()]
    );

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage: result.rows[0],
    });
  } catch (error) {
    console.error("Send ticket message error:", error);
    return res.status(500).json({
      message: "Server error while sending message",
    });
  }
};

module.exports = {
  getTicketMessages,
  sendMessage,
};
