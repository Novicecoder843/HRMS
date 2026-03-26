const db = require("../config/db");


// ✅ CREATE USER
exports.createUser = async (data) => {
  const {
    emp_code,
    first_name,
    last_name,
    email,
    phone_no,
    password_hash,
    role_id,
    company_id,
    dept_id,
    designation_id,
    date_of_joining,
    date_of_exit
  } = data;

  const [result] = await db.execute(
    `INSERT INTO users 
    (emp_code, first_name, last_name, email, phone_no, password_hash, role_id, company_id, dept_id, designation_id, date_of_joining, date_of_exit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      emp_code,
      first_name,
      last_name,
      email,
      phone_no,
      password_hash,
      role_id,
      company_id,
      dept_id || null,
      designation_id || null,
      date_of_joining || null,
      date_of_exit || null
    ]
  );

  return result;
};



// ✅ COUNT USERS (for emp_code)
exports.countUsers = async (company_id) => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) as total FROM users WHERE company_id = ?",
    [company_id]
  );

  return rows[0].total;
};



// ✅ FIND USER BY EMAIL (company-wise)
exports.findByEmail = async (email, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ? AND company_id = ?",
    [email, company_id]
  );

  return rows[0];
};



// ✅ FIND USER FOR LOGIN (global)
exports.findByEmailGlobal = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};



// ✅ GET USER BY ID (company restricted)
exports.getUserById = async (id, company_id) => {
  const [rows] = await db.execute(
    `SELECT 
      id, emp_code, first_name, last_name, email, phone_no,
      role_id, dept_id, designation_id, status, is_active,
      last_login, 
      date_of_joining,
      date_of_exit
     FROM users 
     WHERE id = ? AND company_id = ?`,
    [id, company_id]
  );

  return rows[0];
};



// ✅ GET ALL USERS (company-wise)
exports.getAllUsers = async (company_id) => {
  const [rows] = await db.execute(
    `SELECT 
      id, emp_code, first_name, last_name, email, phone_no,
      role_id, dept_id, designation_id, status,
      is_active, 
      last_login,
      date_of_joining,
      date_of_exit
     FROM users 
     WHERE company_id = ?`,
    [company_id]
  );

  return rows;
};



// ✅ UPDATE USER
exports.updateUser = async (id, company_id, data) => {
  let fields = [];
  let values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const query = `
    UPDATE users 
    SET ${fields.join(", ")} 
    WHERE id = ? AND company_id = ?
  `;

  values.push(id, company_id);

  const [result] = await db.execute(query, values);

  return result;
};


// ✅ DELETE USER
exports.deleteUser = async (id, company_id) => {
  const [result] = await db.execute(
    "DELETE FROM users WHERE id = ? AND company_id = ?",
    [id, company_id]
  );

  return result;
};


// ✅ UPDATE LAST LOGIN
exports.updateLastLogin = async (id) => {
  await db.execute(
    "UPDATE users SET last_login = NOW() WHERE id = ?",
    [id]
  );
};