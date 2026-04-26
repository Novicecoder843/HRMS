const db = require("../config/db");


// ➕ CREATE USER
exports.createUser = async (data) => {
  return db.execute(
    `INSERT INTO users 
    (emp_code, first_name, last_name, email, phone_no, password_hash, role_id, company_id, dept_id, designation_id, date_of_joining, date_of_exit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    Object.values(data)
  );
};


// 🔍 FIND USER (COMPANY)
exports.findByEmail = async (email, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ? AND company_id = ? AND is_active = 1",
    [email, company_id]
  );
  return rows[0];
};


// 🔍 FIND USER (GLOBAL LOGIN)
exports.findByEmailGlobal = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ? AND is_active = 1",
    [email]
  );
  return rows[0];
};


// 🔍 GET ROLE BY NAME (IMPORTANT 🔥)
exports.getRoleByName = async (role_name, company_id) => {
  const [rows] = await db.execute(
    "SELECT id FROM roles WHERE role_name = ? AND company_id = ?",
    [role_name, company_id]
  );
  return rows[0];
};


// 🔍 GET ROLE BY ID
exports.getRoleById = async (id) => {
  const [rows] = await db.execute(
    "SELECT role_name FROM roles WHERE id = ?",
    [id]
  );
  return rows[0];
};

// 🔍 GET ROLE BY ID + COMPANY
exports.getRoleByIdAndCompany = async (role_id, company_id) => {
  const [rows] = await db.execute(
    "SELECT id, role_name FROM roles WHERE id = ? AND company_id = ?",
    [role_id, company_id]
  );
  return rows[0];
};

// 🔍 CHECK ADMIN EXISTS
exports.findAdminByCompany = async (company_id, adminRoleId) => {
  const [rows] = await db.execute(
    "SELECT id FROM users WHERE company_id = ? AND role_id = ? AND is_active = 1",
    [company_id, adminRoleId]
  );
  return rows[0];
};


// 📄 GET USERS
exports.getAllUsers = async (company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE company_id = ? AND is_active = 1",
    [company_id]
  );
  return rows;
};


// 🔍 GET USER BY ID
exports.getUserById = async (id, company_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE id = ? AND company_id = ? AND is_active = 1",
    [id, company_id]
  );
  return rows[0];
};


// ✏️ UPDATE USER
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
     first_name=?, last_name=?, phone_no=?, role_id=?, dept_id=?, designation_id=? 
     WHERE id=? AND company_id=?`,
    [
      first_name,
      last_name,
      phone_no,
      role_id,
      dept_id || null,
      designation_id || null,
      id,
      company_id
    ]
  );
};


// ❌ SOFT DELETE
exports.softDeleteUser = async (id, company_id) => {
  return db.execute(
    "UPDATE users SET is_active = 0 WHERE id = ? AND company_id = ?",
    [id, company_id]
  );
};


