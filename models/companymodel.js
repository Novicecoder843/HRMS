const db = require("../config/db");


// CREATE COMPANY
exports.createCompany = async (data) => {

  const sql = `
    INSERT INTO companies
    (name, alias, address, city, pincode, industry)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    data.name,
    data.alias,
    data.address,
    data.city,
    data.pincode,
    data.industry
  ]);

  return result;
};


// GET ALL COMPANIES
exports.getAllCompanies = async () => {

  const [rows] = await db.execute(
    "SELECT * FROM companies ORDER BY id DESC"
  );

  return rows;
};


// GET COMPANY BY ID
exports.getCompanyById = async (id) => {

  const [rows] = await db.execute(
    "SELECT * FROM companies WHERE id = ?",
    [id]
  );

  return rows[0];
};


// UPDATE COMPANY
exports.updateCompany = async (id, data) => {

  const sql = `
    UPDATE companies
    SET name=?, alias=?, address=?, city=?, pincode=?, industry=?
    WHERE id=?
  `;

  const [result] = await db.execute(sql, [
    data.name,
    data.alias,
    data.address,
    data.city,
    data.pincode,
    data.industry,
    id
  ]);

  return result.affectedRows;
};


// DELETE COMPANY
exports.deleteCompany = async (id) => {

  const [result] = await db.execute(
    "DELETE FROM companies WHERE id = ?",
    [id]
  );

  return result.affectedRows;
};