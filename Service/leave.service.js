const db = require("../config/db");


// 1. Add Leave Type (Master Entry)
exports.addLeaveType = async (data) => {
     const result = await db.query(
          `INSERT INTO leave_types
           (company_id, name, days_per_year, is_carry_forward)
         VALUES ($1, $2, $3, $4) RETURNING *`,
          [
               data.company_id,
               data.name,
               data.days_per_year,
               data.is_carry_forward
          ]
     );
     return result.rows[0];
};

// 2. Assign Leave Balance to an Employee
exports.assignLeaveBalance = async (data) => {
     const result = await db.query(
          `INSERT INTO user_leave_balance (user_id, leave_type_id, total_balance, remaining_balance, used_balance, year) 
           VALUES ($1, $2, $3, $3, 0, $4) 
           ON CONFLICT (user_id, leave_type_id, year) 
           DO UPDATE SET 
                total_balance = EXCLUDED.total_balance,
                -- Naya remaining = Naya total - purana used
                remaining_balance = EXCLUDED.total_balance - user_leave_balance.used_balance,
                updated_at = NOW()
           RETURNING *`,
          [data.user_id, data.leave_type_id, data.total_balance, data.year]
     );
     return result.rows[0];
};

// 3. Apply Leave Request
// 3. Apply Leave Request
exports.applyLeave = async (data) => {
     const currentYear = new Date().getFullYear();

     // Check if user has balance for the current year
     const balanceCheck = await db.query(
          `SELECT remaining_balance, year 
           FROM user_leave_balance 
           WHERE user_id = $1 AND leave_type_id = $2 AND year = $3`,
          [data.user_id, data.leave_type_id, currentYear]
     );

     // Error 1: No record found at all for this user/type/year
     if (balanceCheck.rows.length === 0) {
          throw new Error(`No leave balance assigned for user ID ${data.user_id} and leave type ${data.leave_type_id} for the year ${currentYear}.`);
     }

     const availableBalance = parseFloat(balanceCheck.rows[0].remaining_balance);

     // Error 2: Record exists, but not enough days left
     if (availableBalance < data.total_days) {
          throw new Error(`Insufficient balance. Available: ${availableBalance}, Requested: ${data.total_days}`);
     }

     // 4. Record is valid, insert the application
     const result = await db.query(
          `INSERT INTO leave_applications 
          (user_id, leave_type_id, from_date, to_date, half_day_type, total_days, reason, assigned_to)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
               data.user_id,
               data.leave_type_id,
               data.from_date,
               data.to_date,
               data.half_day_type,
               data.total_days,
               data.reason,
               data.assigned_to
          ]
     );

     return result.rows[0];
};

// 4. Update Status (Approval Logic with Transaction)
exports.updateLeaveStatus = async (applicationId, status) => {
     const client = await db.pgconnection.connect();
     try {
          await client.query('BEGIN'); // Start Transaction

          // 1. Get Application Details
          const appRes = await client.query(
               `SELECT * FROM leave_applications WHERE id = $1 FOR UPDATE`, [applicationId]
          );
          const app = appRes.rows[0];

          if (!app) throw new Error("Leave application not found");
          if (app.status !== 'Pending') throw new Error(`Leave is already ${app.status}`);

          // 2. Update status of the application
          await client.query(
               `UPDATE leave_applications SET status = $1, updated_at = NOW() WHERE id = $2`,
               [status, applicationId]
          );

          // 3. If Approved, deduct the balance
          if (status === 'Approved') {
               const updateBal = await client.query(
                    `UPDATE user_leave_balance 
                 SET used_balance = used_balance + $1, 
                     remaining_balance = remaining_balance - $1
                 WHERE user_id = $2 AND leave_type_id = $3
                 RETURNING remaining_balance`,
                    [app.total_days, app.user_id, app.leave_type_id]
               );

               if (updateBal.rows.length === 0) throw new Error("Failed to update leave balance");
          }

          await client.query('COMMIT'); // Save changes
          return { message: `Leave application ${status} successfully` };
     } catch (error) {
          await client.query('ROLLBACK'); // Cancel changes on error
          throw error;
     } finally {
          client.release();
     }
};