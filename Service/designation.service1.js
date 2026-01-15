const db = require("../config/db");

// CREATE
exports.createDesignation = async (data) => {
     const result = await db.query(
          `INSERT INTO designation (name, department_id)
     VALUES ($1, $2)
     RETURNING *`,
          [data.name, data.department_id]
     );
     return result.rows[0];
};

// READ ALL
exports.findAll = async () => {
     const result = await db.query(
          `SELECT * FROM designation ORDER BY designation_id DESC`
     );
     return result.rows;
};

// READ BY ID
exports.getDesignationById = async (id) => {
     const result = await db.query(
          `SELECT * FROM designation WHERE designation_id = $1`,
          [id]
     );
     return result.rows;
};

// UPDATE
exports.updateDesignation = async (id, data) => {
     const result = await db.query(
          `UPDATE designation SET
     name = $1,
     department_id = $2
     WHERE designation_id = $3
     RETURNING *`,
          [data.name, data.department_id, id]
     );
     return result.rows;
};

// DELETE
exports.deleteDesignation = async (id) => {
     const result = await db.query(
          `DELETE FROM designation WHERE designation_id = $1 RETURNING *`,
          [id]
     );
     return result.rows;
};
