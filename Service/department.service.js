const db = require("../config/db");

// 1. Create Department
exports.createDepartment = async (data) => {
    const { company_id, name } = data;
    const query = `
        INSERT INTO departments (company_id, name)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const result = await db.query(query, [company_id, name]);
    return result.rows[0];
};

// 2. Get All Departments
exports.getAllDepartments = async (page, limit) => {
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM departments`;
    const totalResult = await db.query(countQuery);
    const totalRecords = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    const departmentsQuery = `
        SELECT id, company_id, name
        FROM departments 
        ORDER BY id ASC
        LIMIT $1 OFFSET $2`;

    const result = await db.query(departmentsQuery, [limit, offset]);

    return {
        departments: result.rows,
        totalRecords: totalRecords,
        totalPages: totalPages
    };
};

// 3. Get Department by ID
exports.getDepartmentById = async (id) => {
    const query = `
        SELECT id, company_id, name
        FROM departments 
        WHERE id = $1 
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

// 4. Update Department
exports.updateDepartment = async (id, data) => {
    const { name } = data;
    const query = `
        UPDATE departments 
        SET name = $1
        WHERE id = $2
        RETURNING id, company_id, name;
    `;
    const result = await db.query(query, [name, id]);
    return result.rows[0];
};

// 5. Delete Department (Hard Delete)
exports.deleteDepartment = async (id) => {
    const query = `
        DELETE FROM departments
        WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rowCount;
};