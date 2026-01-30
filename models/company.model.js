const pool = require("./db");

class Company {
  static async create({ name, address, city, pincode, industry, settings }) {
    const query = `
      INSERT INTO companies (name, address, city, pincode, industry, settings)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, address, city, pincode, industry, settings || {}];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query("SELECT * FROM companies WHERE deleted_at IS NULL");
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      "SELECT * FROM companies WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    return result.rows[0];
  }

  static async update(id, { name, address, city, pincode, industry, settings, is_active }) {
    const query = `
      UPDATE companies
      SET name = COALESCE($1, name),
          address = COALESCE($2, address),
          city = COALESCE($3, city),
          pincode = COALESCE($4, pincode),
          industry = COALESCE($5, industry),
          settings = COALESCE($6, settings),
          is_active = COALESCE($7, is_active),
          updated_at = NOW()
      WHERE id = $8 AND deleted_at IS NULL
      RETURNING *;
    `;
    const values = [name, address, city, pincode, industry, settings, is_active, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `UPDATE companies
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *;`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Company;


