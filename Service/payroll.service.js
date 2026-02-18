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

// salry slip


exports.generatePayroll = async (employeeId, month, year) => {
     // Use LOWER() to ensure "January" matches "january"
     const payrollResult = await db.query(
          `SELECT basic_salary, allowances, deductions
         FROM payroll
         WHERE user_id = $1 
         AND LOWER(month) = LOWER($2) 
         AND year = $3`,
          [employeeId, month, year]
     );

     if (payrollResult.rows.length === 0) {
          throw new Error("Payroll data not found in database. Check user_id, month, and year.");
     }

     const payroll = payrollResult.rows[0];

     // Map month string to number for attendance query
     const monthMap = {
          'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6,
          'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12
     };
     const monthNumber = monthMap[month.toLowerCase()];

     const attendanceResult = await db.query(
          `SELECT 
            COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_days,
            COALESCE(SUM(total_hours), 0) AS total_hours
         FROM attendance_master
         WHERE user_id = $1
         AND EXTRACT(MONTH FROM date) = $2
         AND EXTRACT(YEAR FROM date) = $3`,
          [employeeId, monthNumber, year]
     );

     const { present_days, total_hours } = attendanceResult.rows[0];

     // Math
     const basic = Number(payroll.basic_salary);
     const allow = Number(payroll.allowances);
     const deduct = Number(payroll.deductions);
     const finalSalary = ((basic + allow - deduct) / 240) * Number(total_hours); // 240 = 30 days * 8 hours

     return {
          employee_id: employeeId,
          employee_name: "Test Employee",
          basic_salary: basic,
          allowances: allow,
          deductions: deduct,
          present_days,
          total_hours,
          final_salary: finalSalary
     };
};

