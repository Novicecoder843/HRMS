const pool = require('../config/db');

const User = {

  // ✅ Create User
  create: async (data) => {
    const result = await pool.query(
      `INSERT INTO users 
      (emp_code, first_name, last_name, dept_id, designation_id, date_of_joining, date_of_exit, mobile, company_id, email, password_hash, role_id, is_active, last_login) 
      VALUES 
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        data.emp_code,
        data.first_name,
        data.last_name,
        data.dept_id,
        data.designation_id,
        data.date_of_joining,
        data.date_of_exit,
        data.mobile,
        data.company_id,
        data.email,
        data.password_hash,
        data.role_id,
        data.is_active ?? true,
        data.last_login ?? null
      ]
    );
    return result.rows[0];
  },

  // ✅ Find by ID
  findById: async (id) => {
    const result = await pool.query(
      `SELECT * FROM users WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  },

  // ✅ Alias like Sequelize findByPk
  findByPk: async (id) => {
    const result = await pool.query(
      `SELECT * FROM users WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  },

  // ✅ Get All (Optional Company Filter)
  findAll: async (companyId = null) => {
    let query = `SELECT * FROM users`;
    const values = [];

    if (companyId) {
      query += ` WHERE company_id=$1`;
      values.push(companyId);
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  // ✅ Update User (With Existence Check)
  update: async (id, data) => {

    // 🔹 Check if user exists
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (data.emp_code !== undefined) { fields.push(`emp_code=$${index}`); values.push(data.emp_code); index++; }
    if (data.first_name !== undefined) { fields.push(`first_name=$${index}`); values.push(data.first_name); index++; }
    if (data.last_name !== undefined) { fields.push(`last_name=$${index}`); values.push(data.last_name); index++; }
    if (data.dept_id !== undefined) { fields.push(`dept_id=$${index}`); values.push(data.dept_id); index++; }
    if (data.designation_id !== undefined) { fields.push(`designation_id=$${index}`); values.push(data.designation_id); index++; }
    if (data.date_of_joining !== undefined) { fields.push(`date_of_joining=$${index}`); values.push(data.date_of_joining); index++; }
    if (data.date_of_exit !== undefined) { fields.push(`date_of_exit=$${index}`); values.push(data.date_of_exit); index++; }
    if (data.mobile !== undefined) { fields.push(`mobile=$${index}`); values.push(data.mobile); index++; }
    if (data.company_id !== undefined) { fields.push(`company_id=$${index}`); values.push(data.company_id); index++; }
    if (data.email !== undefined) { fields.push(`email=$${index}`); values.push(data.email); index++; }
    if (data.password_hash !== undefined) { fields.push(`password_hash=$${index}`); values.push(data.password_hash); index++; }
    if (data.role_id !== undefined) { fields.push(`role_id=$${index}`); values.push(data.role_id); index++; }
    if (data.is_active !== undefined) { fields.push(`is_active=$${index}`); values.push(data.is_active); index++; }
    if (data.last_login !== undefined) { fields.push(`last_login=$${index}`); values.push(data.last_login); index++; }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Always update timestamp
    fields.push(`updated_at=NOW()`);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')} 
      WHERE id=$${index} 
      RETURNING *
    `;

    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // ✅ Delete User
  delete: async (id) => {

    // Optional: Check existence before delete
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const result = await pool.query(
      `DELETE FROM users WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

};

module.exports = User;
