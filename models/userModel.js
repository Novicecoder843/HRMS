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

// Get employees
exports.getEmployees = async (company_id) => {
 const [rows] = await db.query(
  "SELECT * FROM users WHERE role_id = 4 AND company_id = ?",
  [company_id]
 );
 return rows;
};

// Manager → employees
exports.getManagerEmployees = async (manager_id) => {
 const [rows] = await db.query(
  "SELECT * FROM users WHERE manager_id = ? AND role_id = 4",
  [manager_id]
 );
 return rows;
};

// Find by email
exports.getUserByEmail = async (email) => {
 const [rows] = await db.query(
  "SELECT * FROM users WHERE email = ?",
  [email]
 );
 return rows[0];
};

// Update profile
exports.updateUser = async (data, id) => {
 await db.query("UPDATE users SET ? WHERE id = ?", [data, id]);
};