const pool = require("./db");

class Department {
  static async create({ company_id, dept_name, manager_id }) {
    const query = `
      INSERT INTO departments (company_id, dept_name, manager_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [company_id, dept_name, manager_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      "SELECT * FROM departments WHERE deleted_at IS NULL"
    );
    return result.rows;
  }

  static async getById(dept_id) {
    const result = await pool.query(
      "SELECT * FROM departments WHERE dept_id = $1 AND deleted_at IS NULL",
      [dept_id]
    );
    return result.rows[0];
  }

  static async update(dept_id, data) {
    const query = `
      UPDATE departments
      SET
        company_id = COALESCE($1, company_id),
        dept_name = COALESCE($2, dept_name),
        manager_id = COALESCE($3, manager_id),
        updated_at = NOW()
      WHERE dept_id = $4 AND deleted_at IS NULL
      RETURNING *;
    `;
    const values = [
      data.company_id,
      data.dept_name,
      data.manager_id,
      dept_id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(dept_id) {
    const result = await pool.query(
      "UPDATE departments SET deleted_at = NOW() WHERE dept_id = $1 RETURNING *",
      [dept_id]
    );
    return result.rows[0];
  }
}

module.exports = Department;
