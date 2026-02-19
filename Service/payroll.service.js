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




// 2. Define the Service Logic






const generatePayroll = async (employeeId, month, year) => {
     // Database query updated to include more fields from the users table
     const payrollResult = await db.query(
          `SELECT 
            p.basic_salary, p.allowances, p.deductions, p.net_salary,
            u.name as employee_name, u.emp_code, u.designation, 
            u.join_date, u.role, u.address, u.city, u.pincode
         FROM public.payroll p
         JOIN public.users u ON p.user_id = u.employee_id
         WHERE p.user_id = $1 
         AND LOWER(p.month) = LOWER($2) 
         AND p.year = $3`,
          [employeeId, month, year]
     );

     if (payrollResult.rows.length === 0) {
          throw new Error("Payroll data not found for the specified period.");
     }

     const payroll = payrollResult.rows[0];

     // Numbers ensure calculation accuracy
     const basic = Number(payroll.basic_salary) || 0;
     const allow = Number(payroll.allowances) || 0;
     const deduct = Number(payroll.deductions) || 0;
     const finalSalary = (basic + allow - deduct).toFixed(2);

     return {
          // --- Company Branding ---
          company_name: "TECH SOLUTIONS PVT LTD",
          company_address: "21023 Pearson Point Road, Gateway Avenue",

          // --- Header Right Side ---
          period_header: `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`,

          // --- Employee Info (From Database Schema) ---
          employee_id: employeeId,
          emp_code: payroll.emp_code || `EMP${employeeId}`, // Database ka emp_code use kiya
          employee_name: payroll.employee_name,
          designation: payroll.designation || "Staff",
          role: payroll.role || "developer",
          joining_date: payroll.join_date
               ? new Date(payroll.join_date).toLocaleDateString('en-GB')
               : "N/A",

          // Employee Address (Extra detail for professional look)
          employee_address: `${payroll.address || ''}, ${payroll.city || ''} - ${payroll.pincode || ''}`,

          // --- Salary Table Breakdown ---
          basic_salary: basic.toFixed(2),
          allowances: allow.toFixed(2),
          deductions: deduct.toFixed(2),
          total_earnings: (basic + allow).toFixed(2),
          total_deductions: deduct.toFixed(2),
          final_salary: finalSalary
     };
};

module.exports = { generatePayroll };

// const generatePayroll = async (employeeId, month, year) => {
//      // Database query updated to include more fields from the users table
//      const payrollResult = await db.query(
//           `SELECT 
//             p.basic_salary, p.allowances, p.deductions, p.net_salary,
//             u.name as employee_name, u.emp_code, u.designation_id, 
//             u.join_date, u.role_id, u.company,u.company_address,
//          FROM public.payroll p
//          JOIN public.users u ON p.user_id = u.employee_id
//          WHERE p.user_id = $1 
//          AND LOWER(p.month) = LOWER($2) 
//          AND p.year = $3`,
//           [employeeId, month, year]
//      );

//      if (payrollResult.rows.length === 0) {
//           throw new Error("Payroll data not found for the specified period.");
//      }

//      const payroll = payrollResult.rows[0];

//      // Numbers ensure calculation accuracy
//      const basic = Number(payroll.basic_salary) || 0;
//      const allow = Number(payroll.allowances) || 0;
//      const deduct = Number(payroll.deductions) || 0;
//      const finalSalary = (basic + allow - deduct).toFixed(2);

//      return {
//           // --- Company Branding ---
//           company_name: "TECH SOLUTIONS PVT LTD",
//           company_address: "21023 Pearson Point Road, Gateway Avenue",

//           // --- Header Right Side ---
//           period_header: `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`,

//           // --- Employee Info (From Database Schema) ---
//           employee_id: employeeId,
//           emp_code: payroll.emp_code || `EMP${employeeId}`, // Database ka emp_code use kiya
//           employee_name: payroll.employee_name,
//           designation: payroll.designation_id || "Staff",
//           role: payroll.role || "Employee",
//           joining_date: payroll.join_date
//                ? new Date(payroll.join_date).toLocaleDateString('en-GB')
//                : "N/A",

//           basic_salary: basic.toFixed(2),
//           allowances: allow.toFixed(2),
//           deductions: deduct.toFixed(2),
//           total_earnings: (basic + allow).toFixed(2),
//           total_deductions: deduct.toFixed(2),
//           final_salary: finalSalary
//      };
// };

// module.exports = { generatePayroll };




