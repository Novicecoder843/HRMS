const db = require("../config/db");

// CREATE
exports.createDepartment = async ({ company_id, dept_name, description }) => {
  const [result] = await db.query(
    `INSERT INTO departments (company_id, dept_name, description)
     VALUES (?, ?, ?)`,
    [company_id, dept_name, description]
  );
  return result;
};

// ✅ 🔥 FIND DUPLICATE (NEW - VERY IMPORTANT)
exports.findDepartmentByName = async (dept_name, company_id) => {
  const [rows] = await db.query(
    `SELECT * FROM departments 
     WHERE dept_name = ? AND company_id = ?`,
    [dept_name, company_id]
  );
  return rows[0];
};

// GET ALL
exports.getDepartments = async (company_id) => {
  const [rows] = await db.query(
    "SELECT * FROM departments WHERE company_id = ?",
    [company_id]
  );
  return rows;
};

// GET BY ID
exports.getDepartmentById = async (id, company_id) => {
  const [rows] = await db.query(
    "SELECT * FROM departments WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
  return rows[0];
};

// UPDATE
exports.updateDepartment = async (id, company_id, dept_name, description) => {
  const [result] = await db.query(
    `UPDATE departments 
     SET dept_name = ?, description = ?
     WHERE id = ? AND company_id = ?`,
    [dept_name, description, id, company_id]
  );
  return result;
};

// DELETE
exports.deleteDepartment = async (id, company_id) => {
  const [result] = await db.query(
    "DELETE FROM departments WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
  return result;
};