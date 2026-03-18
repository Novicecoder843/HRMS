const db = require("../config/db");

// Create company
exports.createCompany = async (companyData) => {
  const { name, email, password, address, city } = companyData;

  const query = `
    INSERT INTO companies (name, email, password, address, city)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    name,
    email,
    password,
    address,
    city
  ]);

  return result;
};

// Find company by email
exports.findByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM companies WHERE email = ?",
    [email]
  );

  return rows[0];
};

// Get company by id
exports.getCompanyById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id,name,email,address,city FROM companies WHERE id = ?",
    [id]
  );

  return rows[0];
};