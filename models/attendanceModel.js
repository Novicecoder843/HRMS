const db = require("../config/db");

// 🔍 GET TODAY ATTENDANCE
exports.getTodayAttendance = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM attendance 
     WHERE user_id = ? AND date = CURDATE()`,
    [user_id]
  );
  return rows[0];
};

// ✅ CHECK-IN
exports.checkIn = async (user_id, company_id) => {
  return db.execute(
    `INSERT INTO attendance (user_id, company_id, check_in, date)
     VALUES (?, ?, NOW(), CURDATE())`,
    [user_id, company_id]
  );
};

// ✅ CHECK-OUT
exports.checkOut = async (user_id) => {
  return db.execute(
    `UPDATE attendance 
     SET check_out = NOW()
     WHERE user_id = ? AND date = CURDATE()`,
    [user_id]
  );
};

// 📄 MY ATTENDANCE
exports.getMyAttendance = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM attendance 
     WHERE user_id = ? 
     ORDER BY date DESC`,
    [user_id]
  );
  return rows;
};

// 👥 ALL / TEAM ATTENDANCE
exports.getCompanyAttendance = async (company_id) => {
  const [rows] = await db.execute(
    `SELECT a.*, u.first_name, u.last_name
     FROM attendance a
     JOIN users u ON a.user_id = u.id
     WHERE a.company_id = ?
     ORDER BY a.date DESC`,
    [company_id]
  );
  return rows;
};