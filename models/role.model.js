const pool = require('../config/db');

const Role = {

    create: async (role) => {
        const result = await pool.query(
            `INSERT INTO roles (role_name, company_id, status) 
             VALUES ($1, $2, $3) RETURNING *`,
            [role.role_name, role.company_id, role.status ?? true]
        );
        return result.rows[0];
    },

    findById: async (id) => {
        const result = await pool.query(`SELECT * FROM roles WHERE id=$1`, [id]);
        return result.rows[0];
    },

    findAll: async () => {
        const result = await pool.query(`SELECT * FROM roles`);
        return result.rows;
    },

    update: async (id, data) => {
        const result = await pool.query(
            `UPDATE roles 
             SET role_name=$1, status=$2, updated_at=NOW()
             WHERE id=$3 RETURNING *`,
            [data.role_name, data.status, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await pool.query(
            `DELETE FROM roles WHERE id=$1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }

};

module.exports = Role;
