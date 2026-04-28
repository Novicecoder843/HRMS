const db = require("../config/db");

module.exports = async (company_id) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) as count FROM users WHERE company_id = ?`,
    [company_id]
  );

  const next = rows[0].count + 1;
  return `EMP${String(next).padStart(3, "0")}`;
};