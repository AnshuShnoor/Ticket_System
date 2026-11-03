const fs = require("node:fs/promises");
const path = require("node:path");
const pool = require("../config/db");

async function initializeDatabase() {
  const schemaPath = path.resolve(__dirname, "../../../database/schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");

  await pool.query(schema);
  console.log("Database schema initialized.");
}

initializeDatabase()
  .catch((error) => {
    console.error("Database schema initialization failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
