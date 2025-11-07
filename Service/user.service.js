const db = require("../config/db");

//Create User
exports.createUser = async (data) => {
  try {
    const result = await db.query(
      `INSERT INTO users (name,company_id,email,mobile,designation,role,address,city,pincode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        data.name,
        data.company_id,
        data.email,
        data.mobile,
        data.designation,
        data.role,
        data.address,
        data.city,
        data.pincode || null,
      ]
    );

    return result.rows[0];
  } catch (error) {
    return error;
  }
};

//ReadUser

exports.getAllUsers = async () => {
  try {
    const result = await db.query(`SELECT * FROM users ORDER BY id DESC`);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

//ReadUser by id
exports.getUserById = async (id) => {
  try {
    const result = await db.query(`SELECT * FROM users WHERE id= $1`, [id]);
    return result.rows;
  } catch (error) {
    return error;
  }
};

// Update User
exports.updateUser = async (id, data) => {
  try {
    const result = await db.query(
      `UPDATE users SET
        name=$1,
        company_id=$2,
        email=$3,
        mobile=$4,
        designation=$5,
        role=$6,
        address=$7,
        city=$8,
        pincode=$9,
        updated_at=NOW()
      WHERE id=$10
      RETURNING *`,
      [
        data.name,
        data.company_id,
        data.email,
        data.mobile,
        data.designation,
        data.role,
        data.address,
        data.city,
        data.pincode,
        id,
      ]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

//Delete User
exports.deleteUser = async (id) => {
  try {
    const result = await db.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
      id,
    ]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};
