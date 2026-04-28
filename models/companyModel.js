const db = require("../config/db");

//  Register company
exports.registerCompany = async (data) => {
  const { name, email, password, ALIAS, pincode, address, city } = data;

  const [result] = await db.execute(
    `INSERT INTO companies 
     (name, email, password, ALIAS, pincode, address, city)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password, ALIAS, pincode, address, city]
  );

  return result;
};


// 🔍 Find company by email
exports.findByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM companies WHERE email = ?",
    [email]
  );
  return rows[0];
};

// 👤 Get company profile
exports.findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT id, name, email, ALIAS, pincode, address, city 
     FROM companies WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// ✏️ Update company
exports.updateCompany = async (id, data) => {
  const { name, ALIAS, pincode, address, city } = data;

  return db.execute(
    `UPDATE companies 
     SET name = ?, ALIAS = ?, pincode = ?, address = ?, city = ?
     WHERE id = ?`,
    [name, ALIAS, pincode, address, city, id]
  );
};