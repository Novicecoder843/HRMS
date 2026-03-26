const db = require("../config/db");


// ✅ CREATE
exports.createDesignation = async ({
  company_id,
  department_id,
  desig_name,
  description
}) => {
  const [result] = await db.query(
    `INSERT INTO designations 
     (company_id, department_id, desig_name, description)
     VALUES (?, ?, ?, ?)`,
    [company_id, department_id, desig_name, description]
  );

  return result;
};



// ✅ 🔥 FIND DUPLICATE (VERY IMPORTANT)
exports.findDesignation = async (desig_name, department_id, company_id) => {
  const [rows] = await db.query(
    `SELECT * FROM designations 
     WHERE desig_name = ? 
     AND department_id <=> ? 
     AND company_id = ?`,
    [desig_name, department_id, company_id]
  );
  return rows[0];
};



// ✅ GET ALL (COMPANY SAFE)
exports.getDesignations = async (company_id, department_id) => {
  const [rows] = await db.query(
    `SELECT d.*, dept.dept_name 
     FROM designations d
     LEFT JOIN departments dept 
     ON d.department_id = dept.id
     WHERE d.company_id = ? AND d.department_id = ?`,
    [company_id, department_id]
  );
  return rows;
};



// ✅ GET BY ID (SAFE)
exports.getDesignationById = async (id, company_id) => {
  const [rows] = await db.query(
    `SELECT * FROM designations 
     WHERE id = ? AND company_id = ?`,
    [id, company_id]
  );
  return rows[0];
};



// ✅ UPDATE (SAFE)
exports.updateDesignation = async (
  id,
  company_id,
  desig_name,
  description,
  department_id
) => {
  const [result] = await db.query(
    `UPDATE designations 
     SET desig_name = ?, description = ?, department_id = ?
     WHERE id = ? AND company_id = ?`,
    [desig_name, description, department_id, id, company_id]
  );
  return result;
};



// ✅ DELETE (SAFE)
exports.deleteDesignation = async (id, company_id) => {
  const [result] = await db.query(
    `DELETE FROM designations 
     WHERE id = ? AND company_id = ?`,
    [id, company_id]
  );
  return result;
};