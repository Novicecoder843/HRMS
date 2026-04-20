const db = require("../config/db");

// ➕ CREATE
exports.createDepartment = async (dept_name, description, company_id) => {
  return db.execute(
    `INSERT INTO departments (dept_name, description, company_id)
     VALUES (?, ?, ?)`,
    [dept_name, description || null, company_id]
  );
};

// 🔍 CHECK DUPLICATE
exports.findDepartmentByName = async (dept_name, company_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM departments 
     WHERE dept_name = ? AND company_id = ?`,
    [dept_name, company_id]
  );
  return rows[0];
};

// 📄 GET ALL
exports.getDepartments = async (company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM departments WHERE company_id = ?",
    [company_id]
  );
  return rows;
};

// 🔍 GET BY ID
exports.getDepartmentById = async (id, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM departments WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
  return rows[0];
};

// ✏️ UPDATE
exports.updateDepartment = async (id, dept_name, description, company_id) => {
  return db.execute(
    `UPDATE departments 
     SET dept_name = ?, description = ?
     WHERE id = ? AND company_id = ?`,
    [dept_name, description || null, id, company_id]
  );
};

// ❌ DELETE
exports.deleteDepartment = async (id, company_id) => {
  return db.execute(
    "DELETE FROM departments WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
};