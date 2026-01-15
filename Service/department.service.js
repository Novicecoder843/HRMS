const db = require("../config/db");

// CREATE Department
exports.createDepartment = async (data) => {
     try {
          const result = await db.query(
               `INSERT INTO department(name, company_id)
       VALUES ($1, $2)
       RETURNING *`,
               [data.name, data.company_id]
          );
          return result.rows[0];
     } catch (error) {
          throw error;
     }
};

// READ ALL Departments
exports.findAll = async () => {
     try {
          const result = await db.query(
               `SELECT * FROM department
       ORDER BY department_id DESC
       LIMIT 8`
          );
          return result.rows;
     } catch (error) {
          throw error;
     }
};

// READ Department BY ID
exports.getDepartmentById = async (id) => {
     try {
          const result = await db.query(
               `SELECT * FROM department WHERE department_id = $1`,
               [id]
          );
          return result.rows;
     } catch (error) {
          throw error;
     }
};

// UPDATE Department
exports.updateDepartment = async (id, data) => {
     try {
          const result = await db.query(
               `UPDATE department SET
       name = $1,
       company_id = $2
       WHERE department_id = $3
       RETURNING *`,
               [data.name, data.company_id, id]
          );
          return result.rows;
     } catch (error) {
          throw error;
     }
};

// DELETE Department (Hard Delete)
exports.deleteDepartment = async (id) => {
     try {
          const result = await db.query(
               `DELETE FROM department WHERE department_id = $1 RETURNING *`,
               [id]
          );
          return result.rows;
     } catch (error) {
          throw error;
     }
};
