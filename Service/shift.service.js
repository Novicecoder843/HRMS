const db = require("../config/db");

exports.createShift = async (data) => {
     const { shift_name, start_time, end_time, company_id } = data;
     const result = await db.query(
          `INSERT INTO shifts (shift_name, start_time, end_time, company_id) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
          [shift_name, start_time, end_time, company_id]
     );
     return result.rows[0];
};

exports.getAllShifts = async (company_id, page, limit) => {
     const offset = (page - 1) * limit;

     // Fetch paginated shifts
     const shifts = await db.query(
          `SELECT * FROM shifts WHERE company_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
          [company_id, limit, offset]
     );

     // Get total count for pagination metadata
     const count = await db.query(`SELECT COUNT(*) FROM shifts WHERE company_id = $1`, [company_id]);

     return {
          shifts: shifts.rows,
          totalCount: parseInt(count.rows[0].count),
          currentPage: page,
          totalPages: Math.ceil(count.rows[0].count / limit)
     };
};

exports.assignShift = async (user_id, shift_id) => {
     // We deactivate old shift assignments first (optional business logic)
     await db.query(`UPDATE user_shifts SET is_active = false WHERE user_id = $1`, [user_id]);

     const result = await db.query(
          `INSERT INTO user_shifts (user_id, shift_id) VALUES ($1, $2) RETURNING *`,
          [user_id, shift_id]
     );
     return result.rows[0];
};

exports.getUserCurrentShift = async (userId) => {
     const result = await db.query(
          `SELECT s.* FROM shifts s 
         JOIN user_shifts us ON s.id = us.shift_id 
         WHERE us.user_id = $1 AND us.is_active = true`,
          [userId]
     );
     return result.rows[0];
};