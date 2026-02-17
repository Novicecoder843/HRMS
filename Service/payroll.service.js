const db = require("../config/db");

/**
 * Create Payroll
 */
exports.createPayroll = async (data) => {
     const query = `
    INSERT INTO payroll 
    (user_id, month, year, basic_salary, allowances, deductions, payment_status)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
  `;

     const values = [
          data.user_id,
          data.month,
          data.year,
          data.basic_salary,
          data.allowances,
          data.deductions,
          data.payment_status || "Pending"
     ];

     const result = await db.query(query, values);
     return result.rows[0];
};


/**
 * Get All Payroll
 */


exports.getAllPayroll = async () => {
     const query = `
        SELECT 
            p.*, 
            u.name, 
            u.email 
        FROM payroll p 
        -- Changed 'u.user_id' or 'u.id' to 'u.employee_id'
        JOIN users u ON p.user_id = u.employee_id 
        ORDER BY p.year DESC, p.month DESC;
    `;
     const result = await db.query(query);
     return result.rows;
};




/**
 * Get Payroll By ID
 */
exports.getPayrollById = async (id) => {
     const result = await db.query(
          "SELECT * FROM payroll WHERE id = $1",
          [id]
     );

     return result.rows[0];
};


/**
 * Update Payment Status
 */





 //Update Payroll (salary fields)


exports.updatePayrollRecord = async (id, data) => {
     // We destructure the data coming from req.body
     const { month, year, basic_salary, allowances, deductions, payment_status } = data;

     const query = `
        UPDATE payroll 
        SET month = $1, 
            year = $2, 
            basic_salary = $3, 
            allowances = $4, 
            deductions = $5, 
            payment_status = $6
        WHERE id = $7
        RETURNING *;
    `;

     const values = [month, year, basic_salary, allowances, deductions, payment_status, id];
     const result = await db.query(query, values);
     return result.rows[0];
};



/**
 * Delete Payroll
 */
exports.deletePayrollRecord = async (id) => {
     const query = `DELETE FROM payroll WHERE user_id = $1 RETURNING *;`;

     const result = await db.query(query, [id]);

     console.log("Rows deleted:", result.rowCount);
     console.log("Deleted data:", result.rows);

     return result.rows[0];
};
