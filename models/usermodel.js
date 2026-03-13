const db = require("../config/db");

// CREATE USER
exports.createUser = async (data) => {

const sql = `
INSERT INTO users
(emp_code, first_name, last_name, email, phone,
company_id, dept_id, designation_id, role_id,
date_of_joining, date_of_exit, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const [result] = await db.execute(sql,[
data.emp_code,
data.first_name,
data.last_name,
data.email,
data.phone,
data.company_id,
data.dept_id,
data.designation_id,
data.role_id,
data.date_of_joining,
data.date_of_exit,
data.status
]);

return result;

};


// GET ALL USERS
exports.getAllUsers = async () => {

const [rows] = await db.execute(
"SELECT * FROM users"
);

return rows;

};


// GET USER BY ID
exports.getUserById = async (id) => {

const [rows] = await db.execute(
"SELECT * FROM users WHERE id=?",
[id]
);

return rows;

};


// UPDATE USER
exports.updateUser = async (id,data) => {

const sql = `
UPDATE users
SET first_name=?, last_name=?, phone=?, status=?
WHERE id=?
`;

const [result] = await db.execute(sql,[
data.first_name,
data.last_name,
data.phone,
data.status,
id
]);

return result;

};


// DELETE USER
exports.deleteUser = async (id) => {

const [result] = await db.execute(
"DELETE FROM users WHERE id=?",
[id]
);

return result;

};