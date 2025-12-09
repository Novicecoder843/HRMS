const db = require("../config/db");

// 1. Create Role
exports.createRole = async (data) => {
    const { role_name, company_id } = data;
    const final_company_id = company_id || null;
    
    let checkQuery = `SELECT id FROM roles WHERE role_name = $1`;
    let checkValues = [role_name];

    if (final_company_id) {
        checkQuery += ` AND company_id = $2`;
        checkValues.push(final_company_id);
    } else {
        checkQuery += ` AND company_id IS NULL`;
    }

    const existingRole = await db.query(checkQuery, checkValues);
    if (existingRole.rows.length > 0) {
        return null; 
    }
    
   
    const query = `
        INSERT INTO roles (role_name, company_id)
        VALUES ($1, $2)
        RETURNING id, role_name, company_id;
    `;
    const result = await db.query(query, [role_name, final_company_id]);
    return result.rows[0];
};

// 2. Get All Roles
exports.getAllRoles = async () => {
    const query = `
        SELECT id, role_name, company_id
        FROM roles 
        ORDER BY company_id NULLS FIRST, id ASC
    `;
    const result = await db.query(query);
    return result.rows;
};

// 3. Get Role by ID
exports.getRoleById = async (id) => {
    const query = `
        SELECT id, role_name, company_id
        FROM roles 
        WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

// 4. Update Role Name
exports.updateRole = async (id, data) => {
    const { role_name } = data;
    const query = `
        UPDATE roles 
        SET role_name = $1
        WHERE id = $2
        RETURNING id, role_name, company_id;
    `;
    const result = await db.query(query, [role_name, id]);
    return result.rows[0];
};

// 5. Delete Role 
exports.deleteRole = async (id) => {
    const query = `
        DELETE FROM roles
        WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rowCount;
};