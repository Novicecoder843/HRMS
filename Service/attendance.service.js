const db = require("../config/db");

exports.createAttendance = async (data) => {
     try {
          const result = await db.quary(
               `INSERT INTO Attendance
          (user_id,Attendance_data,status,check_in,check_out,remarks)
          values($1, $2, $3, $4, $5, $6)
          RETURNING *`
               [
               data.user_id,
               data.Attendance_data,
               data.status,
               data.check_in,
               data.check_out,
               data.remarks
               ]
          );
          return result.rows[0];
     } catch (error) {
          throw error;
     }
};

// Read all attendance

exports.findAll = async () => {
     try {
          const result = await db.query(
               `SELECT * FROM attendance
       WHERE is_deleted = FALSE
       ORDER BY attendance_id DESC
       LIMIT 10`
          );

          return result.rows;
     } catch (error) {
          throw error;
     }
};

// read attendance by id

exports.getAttendanceById = async (id) => {
     try {
          const result = await db.query(
               `SELECT * FROM attendance
       WHERE attendance_id = $1`,
               [id]
          );

          return result.rows;
     } catch (error) {
          throw error;
     }
};

// update attendance

exports.updateAttendance = async (id, data) => {
     try {
          const result = await db.query(
               `UPDATE attendance SET
       status = $1,
       check_in = $2,
       check_out = $3,
       remarks = $4,
       updated_at = CURRENT_TIMESTAMP
       WHERE attendance_id = $5
       RETURNING *`,
               [
                    data.status,
                    data.check_in,
                    data.check_out,
                    data.remarks,
                    id
               ]
          );

          return result.rows;
     } catch (error) {
          throw error;
     }
};


// delete attendance
exports.deleteAttendance = async (id) => {
     try {
          const result = await db.query(
               `DELETE FROM Attendance WHERE Attendance_id = $1 RETURNING *`,
               [id]
          );
          return result.rows;
     } catch (error) {
          throw error;
     }
};
