const db = require("../config/db");

// Create user
exports.createUser = async (data) => {
 const [result] = await db.query("INSERT INTO users SET ?", data);
 return result;
};

// Get all users
exports.getUsers = async (company_id) => {
 const [rows] = await db.query(
  "SELECT * FROM users WHERE company_id = ?",
  [company_id]
 );
 return rows;
};
