const pool = require("../config/db");

const validPriorities = ["low", "medium", "high", "urgent"];

const createTicket = async (req, res) => {
  const { subject, description, category, priority = "medium" } = req.body ?? {};

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
      `INSERT INTO tickets (subject, description, category, priority, customer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, subject, description, category, priority, status,
                 created_at, updated_at`,
      [
        subject.trim(),
        description.trim(),
        category.trim(),
        priority,
        req.user.id,
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

const getMyTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         subject,
         description,
         category,
         priority,
         status,
         created_at,
         updated_at
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

    return res.status(500).json({
      message: "Unable to fetch tickets.",
    });
  }
};


// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    let query = "SELECT * FROM tickets WHERE id = $1";
    let values = [Number(id)];

    // Customers can only view their own tickets
    if (req.user.role === "customer") {
      query += " AND customer_id = $2";
      values.push(req.user.id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      message: "Ticket fetched successfully",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    return res.status(500).json({
      message: "Server error while fetching ticket",
    });
  }
};
module.exports = { createTicket, getMyTickets ,  getTicketById };
