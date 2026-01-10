const db = require("../config/db");

exports.punchInService = async (employee_id, shift_id) => {
  const today = new Date().toISOString().split("T")[0];

  let attRes = await db.query(
    `SELECT * FROM attendance WHERE user_id =$1
        AND date=$2`,
    [employee_id, today]
  );
  let attendance_id;
  if (attRes.rows.length === 0) {
    const newAtt = await db.query(
      `INSERT INTO attendance (user_id, shift_id, date, status)
            VALUES ($1, $2, $3, 'Present') RETURNING id`,
      [employee_id, shift_id, today]
    );
    attendance_id = newAtt.rows[0].id;
  } else {
    attendance_id = attRes.rows[0].id;
  }

 const log = await db.query(
    `INSERT INTO attendance_logs (attendance_id, user_id, punch_type, punch_time)
     VALUES ($1, $2, 'IN', NOW()) RETURNING *`,
    [attendance_id, employee_id]
  );

  return {
    ...log.rows[0],
    user_id: employee_id 
  };
};

exports.punchOutService = async (employee_id) => {
  const today = new Date().toISOString().split("T")[0];

  const attRes = await db.query(
    "SELECT id FROM attendance WHERE user_id = $1 AND date = $2",
    [employee_id, today]
  );

  if (attRes.rows.length === 0) {
    throw new Error("first do punch in");
  }

  const attendance_id = attRes.rows[0].id;

  await db.query(
    "INSERT INTO attendance_logs (attendance_id, user_id, punch_type, punch_time) VALUES ($1, $2, 'OUT', NOW())",
    [attendance_id, employee_id]
  );

  const updateQuery = `
    UPDATE attendance 
    SET 
        total_hours = (
            SELECT EXTRACT(EPOCH FROM (MAX(punch_time) - MIN(punch_time))) / 3600
            FROM attendance_logs
            WHERE attendance_id = $1
        ),
        first_punch_in = (SELECT MIN(punch_time) FROM attendance_logs WHERE attendance_id = $1),
        last_punch_out = (SELECT MAX(punch_time) FROM attendance_logs WHERE attendance_id = $1)
    WHERE id = $1 RETURNING *`;

  const finalRes = await db.query(updateQuery, [attendance_id]);
  return finalRes.rows[0];
};
