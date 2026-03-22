const db = require("../config/db");

// Create company
exports.registerCompany = async (companyData) => {
  const { name, email, password, ALIAS, pincode, address, city } = companyData;

  const query = `
    INSERT INTO companies (name, email, password,ALIAS, pincode, address, city)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    name,
    email,
    password,
    ALIAS ,
    pincode,
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
    "SELECT id,name,email,ALIAS,pincode,address,city FROM companies WHERE id = ?",
    [id]
  );

  return rows[0];
};

// Update company profile

exports.updateCompany = async (id, data) => {
  try {
    let fields = [];
    let values = [];

    for (let key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE companies
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.query(query, values);

    return result;

  } catch (error) {
    throw error;
  }
};