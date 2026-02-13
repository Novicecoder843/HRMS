const pool = require('../config/db');
const bcrypt = require('bcrypt');

const Company = {
    signup: async (company) => {
        const hashedPassword = await bcrypt.hash(company.password, 10);
        const result = await pool.query(
            `INSERT INTO companies 
            (name, alias, address, email, password, city, pincode)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [company.name, company.alias, company.address, company.email, hashedPassword, company.city, company.pincode]
        );
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const result = await pool.query(`SELECT * FROM companies WHERE email=$1`, [email]);
        return result.rows[0];
    }
};

module.exports = Company;
