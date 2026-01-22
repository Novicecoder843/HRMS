const db = require("../config/db");

/* ================= CREATE ROLE ================= */
exports.createRole = async (data) => {
     const result = await db.query(
          `INSERT INTO roles (role_name, company_id)
     VALUES ($1, $2)
     RETURNING *`,
          [data.role_name, data.company_id]
     );

     return result.rows[0];
};

/* ================= READ ALL ROLES ================= */
// exports.findAll = async (company_id) => {
//      const result = await db.query(
//           `SELECT *
//      FROM roles
//      WHERE company_id = $1
//      ORDER BY role_id DESC
//      LIMIT 8`,
          // [company_id]
//      );
//      return result.rows;
// };
exports.findAll = async (company_id) => {
     const result = await db.query(
          `SELECT * FROM roles WHERE company_id = $1 ORDER BY role_id DESC`,
          [company_id]
     );
     return result.rows;
};


/* ================= READ ROLE BY ID ================= */
exports.getRoleById = async (id, company_id) => {
     const result = await db.query(
          `SELECT * FROM roles WHERE role_id = $1 AND company_id = $2`,
          [id, company_id]
     );
     return result.rows[0];
};


/* ================= UPDATE ROLE ================= */
exports.updateRole = async (id, data, company_id) => {
     const result = await db.query(
          `UPDATE roles
     SET role_name = $1
     WHERE role_id = $2 AND company_id = $3
     RETURNING *`,
          [data.role_name, id, company_id]
     );
     return result.rows[0];
};
/* ================= DELETE ROLE ================= */
exports.deleteRole = async (id, company_id) => {
     const result = await db.query(
          `DELETE FROM roles
     WHERE role_id = $1 AND company_id = $2
     RETURNING *`,
          [id, company_id]
     );
     return result.rows[0];
};
