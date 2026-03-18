const db = require("../config/db");

exports.findRole = async (role_name, company_id) => {

 const [rows] = await db.query(
  "SELECT * FROM roles WHERE role_name = ? AND company_id = ?",
  [role_name, company_id]
 );

 return rows[0];

};


exports.createRole = async (data) => {

 const [result] = await db.query(
  "INSERT INTO roles SET ?",
  data
 );

 return result;

};

exports.getRoles = async () => {

 const [rows] = await db.query(
  "SELECT * FROM roles"
 );

 return rows;

};


exports.getRoleById = async (id) => {

 const [rows] = await db.query(
  "SELECT * FROM roles WHERE id = ?",
  [id]
 );

 return rows[0];

};


exports.getRoleByName = async (role_name) => {

 const [rows] = await db.query(
  "SELECT * FROM roles WHERE role_name = ?",
  [role_name]
 );

 return rows;

};