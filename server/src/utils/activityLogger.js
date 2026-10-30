
const pool = require("../config/db");

const logTicketActivity = async (
  ticketId,
  actorId,
  action,
  oldValue = null,
  newValue = null
) => {
  try {
    await pool.query(
      `INSERT INTO ticket_activity
       (ticket_id, actor_id, action, old_value, new_value)
       VALUES ($1, $2, $3, $4, $5)`,
      [ticketId, actorId || null, action, oldValue, newValue]
    );

    console.log("Ticket activity logged successfully.");
  } catch (error) {
    console.error("Activity logging error:", error.message);
  }
};

module.exports = logTicketActivity;
