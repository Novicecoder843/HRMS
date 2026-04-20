const db = require("../config/db");

// ➕ CREATE ROLE
exports.createRole = async (role_name, company_id) => {
  const [result] = await db.execute(
    "INSERT INTO roles (role_name, company_id) VALUES (?, ?)",
    [role_name, company_id]
  );
  return result;
};

// 🔍 CHECK ROLE EXISTS (FOR DUPLICATE)
exports.findRoleByName = async (role_name, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM roles WHERE role_name = ? AND company_id = ?",
    [role_name, company_id]
  );
  return rows[0];
};

// 📄 GET ALL ROLES
exports.getRoles = async (company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM roles WHERE company_id = ?",
    [company_id]
  );
  return rows;
};

// 🔍 GET ROLE BY ID
exports.getRoleById = async (id, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM roles WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
  return rows[0];
};

// ✏️ UPDATE ROLE
exports.updateRole = async (id, role_name, company_id) => {
  return db.execute(
    "UPDATE roles SET role_name = ? WHERE id = ? AND company_id = ?",
    [role_name, id, company_id]
  );
};

// ❌ DELETE ROLE
exports.deleteRole = async (id, company_id) => {
  return db.execute(
    "DELETE FROM roles WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
};