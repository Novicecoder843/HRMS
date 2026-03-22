const db = require("../config/db");

// ✅ Create Role
exports.createRole = async (role_name, company_id) => {
  await db.query(
    "INSERT INTO roles (role_name, company_id) VALUES (?, ?)",
    [role_name, company_id]
  );
};

// ✅ Check duplicate role
exports.findRole = async (role_name, company_id) => {
  const [rows] = await db.query(
    "SELECT * FROM roles WHERE role_name=? AND company_id=?",
    [role_name, company_id]
  );
  return rows[0];
};

// ✅ Get all roles of company
exports.getRoles = async (company_id) => {
  const [rows] = await db.query(
    "SELECT * FROM roles WHERE company_id=?",
    [company_id]
  );
  return rows;
};

// ✅ Get role by ID
exports.getRoleById = async (id, company_id) => {
  const [rows] = await db.query(
    "SELECT * FROM roles WHERE id=? AND company_id=?",
    [id, company_id]
  );
  return rows[0];
};

// ✅ Get role by name
exports.getRoleByName = async (role_name, company_id) => {
  const [rows] = await db.query(
    "SELECT * FROM roles WHERE role_name=? AND company_id=?",
    [role_name, company_id]
  );
  return rows[0];
};