const db = require("../config/db");

// ➕ CREATE
exports.createDesignation = async (desig_name, dept_id, description, company_id) => {
  return db.execute(
    `INSERT INTO designations (desig_name, dept_id, description, company_id)
     VALUES (?, ?, ?, ?)`,
    [desig_name, dept_id, description || null, company_id]
  );
};

// 🔍 DUPLICATE CHECK
exports.findDesignationByName = async (desig_name, dept_id, company_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM designations 
     WHERE desig_name = ? AND dept_id = ? AND company_id = ?`,
    [desig_name, dept_id, company_id]
  );
  return rows[0];
};

// 📄 GET ALL
exports.getDesignations = async (company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM designations WHERE company_id = ?",
    [company_id]
  );
  return rows;
};

// 🔍 GET BY ID
exports.getDesignationById = async (id, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM designations WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
  return rows[0];
};

// ✏️ UPDATE
exports.updateDesignation = async (id, desig_name, dept_id, description, company_id) => {
  return db.execute(
    `UPDATE designations 
     SET desig_name = ?, dept_id = ?, description = ?
     WHERE id = ? AND company_id = ?`,
    [desig_name, dept_id, description || null, id, company_id]
  );
};

// ❌ DELETE
exports.deleteDesignation = async (id, company_id) => {
  return db.execute(
    "DELETE FROM designations WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
};

// 🔐 CHECK DEPARTMENT
exports.checkDepartment = async (dept_id, company_id) => {
  const [rows] = await db.execute(
    "SELECT id FROM departments WHERE id = ? AND company_id = ?",
    [dept_id, company_id]
  );
  return rows.length;
};