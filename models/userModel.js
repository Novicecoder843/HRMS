const db = require("../config/db");

// ➕ CREATE USER
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

  return db.execute(
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
      dept_id,
      designation_id,
      date_of_joining,
      date_of_exit
    ]
  );
};




// 🔍 FIND USER BY EMAIL
exports.findByEmail = async (email, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ? AND company_id = ?",
    [email, company_id]
  );
  return rows[0];
};



// ✅ CHECK ROLE
exports.checkRole = async (role_id, company_id) => {
  const [rows] = await db.execute(
    "SELECT id FROM roles WHERE id = ? AND company_id = ?",
    [role_id, company_id]
  );
  return rows.length;
};



// ✅ CHECK DEPARTMENT
exports.checkDepartment = async (dept_id, company_id) => {
  const [rows] = await db.execute(
    "SELECT id FROM departments WHERE id = ? AND company_id = ?",
    [dept_id, company_id]
  );
  return rows.length;
};



// ✅ CHECK DESIGNATION
exports.checkDesignation = async (designation_id, dept_id, company_id) => {
  const [rows] = await db.execute(
    `SELECT id FROM designations 
     WHERE id = ? AND dept_id = ? AND company_id = ?`,
    [designation_id, dept_id, company_id]
  );
  return rows.length;
};

// 🔍 FIND USER
exports.findByEmail = async (email, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ? AND company_id = ?",
    [email, company_id]
  );
  return rows[0];
};

exports.getAllUsers = async (company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE company_id = ?",
    [company_id]
  );
  return rows;
};

exports.getUserById = async (id, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
  return rows[0];
};

exports.deleteUser = async (id, company_id) => {
  return db.execute(
    "DELETE FROM users WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
};

exports.updateUser = async (id, data, company_id) => {
  const {
    first_name,
    last_name,
    phone_no,
    role_id,
    dept_id,
    designation_id
  } = data;

  return db.execute(
    `UPDATE users SET 
      first_name=?, last_name=?, phone_no=?, 
      role_id=?, dept_id=?, designation_id=? 
     WHERE id=? AND company_id=?`,
    [
      first_name,
      last_name,
      phone_no,
      role_id,
      dept_id,
      designation_id,
      id,
      company_id
    ]
  );
};



