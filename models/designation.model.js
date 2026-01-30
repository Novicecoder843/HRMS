const pool = require("./db");

class Designation {
  static async create({ name, level, company_id }) {
    const query = `
      INSERT INTO designations (name, level, company_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, level, company_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      "SELECT * FROM designations WHERE deleted_at IS NULL"
    );
    return result.rows;
  }

  static async getById(designation_id) {
    const result = await pool.query(
      "SELECT * FROM designations WHERE designation_id = $1 AND deleted_at IS NULL",
      [designation_id]
    );
    return result.rows[0];
  }

  static async update(designation_id, data) {
    const query = `
      UPDATE designations
      SET
        name = COALESCE($1, name),
        level = COALESCE($2, level),
        company_id = COALESCE($3, company_id),
        updated_at = NOW()
      WHERE designation_id = $4 AND deleted_at IS NULL
      RETURNING *;
    `;
    const values = [
      data.name,
      data.level,
      data.company_id,
      designation_id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(designation_id) {
    const result = await pool.query(
      "UPDATE designations SET deleted_at = NOW() WHERE designation_id = $1 RETURNING *",
      [designation_id]
    );
    return result.rows[0];
  }
}

module.exports = Designation;
