const pool = require("./db");

class User {
  static async create(data) {
    const query = `
      INSERT INTO users (
        emp_code, first_name, last_name, email, phone,
        company_id, dept_id, designation_id, role_id,
        password_hash, date_of_joining, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;

    const values = [
      data.emp_code,
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.company_id,
      data.dept_id,
      data.designation_id,
      data.role_id,
      data.password_hash,
      data.date_of_joining,
      data.status || "ACTIVE"
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      "SELECT * FROM users WHERE deleted_at IS NULL"
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL",
      [id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        dept_id = COALESCE($4, dept_id),
        designation_id = COALESCE($5, designation_id),
        role_id = COALESCE($6, role_id),
        status = COALESCE($7, status),
        date_of_exit = COALESCE($8, date_of_exit),
        updated_at = NOW()
      WHERE user_id = $9 AND deleted_at IS NULL
      RETURNING *;
    `;

    const values = [
      data.first_name,
      data.last_name,
      data.phone,
      data.dept_id,
      data.designation_id,
      data.role_id,
      data.status,
      data.date_of_exit,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "UPDATE users SET deleted_at = NOW(), is_active = false WHERE user_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = User;
