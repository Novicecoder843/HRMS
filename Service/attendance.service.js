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
            VALUES ($1, $2, $3, 'Absent') RETURNING id`,
      [employee_id, shift_id, today]
    );
    attendance_id = newAtt.rows[0].id;
  } else {
    attendance_id = attRes.rows[0].id;
  }

  const lastLog = await db.query(
    `SELECT punch_type FROM attendance_logs 
     WHERE attendance_id = $1 ORDER BY punch_time DESC LIMIT 1`,
    [attendance_id]
  );

  if (lastLog.rows.length > 0 && lastLog.rows[0].punch_type === "IN") {
    throw new Error("You already have punch-in");
  }

  const log = await db.query(
    `INSERT INTO attendance_logs (attendance_id, user_id, punch_type, punch_time)
     VALUES ($1, $2, 'IN', NOW()) RETURNING *`,
    [attendance_id, employee_id]
  );

  return {
    ...log.rows[0],
    user_id: employee_id,
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

  const lastLog = await db.query(
    `SELECT punch_type FROM attendance_logs 
     WHERE attendance_id = $1 ORDER BY punch_time DESC LIMIT 1`,
    [attendance_id]
  );

  if (lastLog.rows.length === 0 || lastLog.rows[0].punch_type === "OUT") {
    throw new Error("First do punch-in");
  }

  await db.query(
    "INSERT INTO attendance_logs (attendance_id, user_id, punch_type, punch_time) VALUES ($1, $2, 'OUT', NOW())",
    [attendance_id, employee_id]
  );

  const updateQuery = `
    UPDATE attendance 
    SET 
        total_minutes = ( 
            WITH logs AS (
                SELECT 
                    punch_time,
                    punch_type,
                    LEAD(punch_time) OVER (ORDER BY punch_time) as next_punch_time
                FROM attendance_logs
                WHERE attendance_id = $1
            )
            
            
            SELECT COALESCE(ROUND(SUM(EXTRACT(EPOCH FROM (next_punch_time - punch_time)) / 60)), 0)
            FROM logs
            WHERE punch_type = 'IN' AND next_punch_time IS NOT NULL
        ),

        status = CASE 
            WHEN (
                SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (next_punch_time - punch_time)) / 60), 0)
                FROM (
                    SELECT punch_time, punch_type, LEAD(punch_time) OVER (ORDER BY punch_time) as next_punch_time
                    FROM attendance_logs WHERE attendance_id = $1
                ) AS logs_internal
                WHERE punch_type = 'IN' AND next_punch_time IS NOT NULL
            ) >= 480 THEN 'Present' 
            ELSE 'Absent'
        END,

        first_punch_in = (SELECT MIN(punch_time) FROM attendance_logs WHERE attendance_id = $1),
        last_punch_out = (SELECT MAX(punch_time) FROM attendance_logs WHERE attendance_id = $1)
    WHERE id = $1 RETURNING *`;
  const finalRes = await db.query(updateQuery, [attendance_id]);
  return finalRes.rows[0];
};

exports.getReportService = async (employee_id, filterType) => {
  let startDate, endDate;

  // 1. Filter Logic (Interval Setup)
  if (filterType === "today") {
    startDate = 'CURRENT_DATE';
    endDate = 'CURRENT_DATE';
  } else if (filterType === "weekly") {
    startDate = "CURRENT_DATE - INTERVAL '6 days'";
    endDate = 'CURRENT_DATE';
  } else if (filterType === "currentmonth") {
    startDate = "DATE_TRUNC('month', CURRENT_DATE)";
    endDate = "CURRENT_DATE";
  } else {
    startDate = `TO_DATE('${filterType}', 'Mon-YY')`;
    endDate = `(TO_DATE('${filterType}', 'Mon-YY') + INTERVAL '1 month' - INTERVAL '1 day')`;
  }

  const query = `
    WITH user_info AS (
        SELECT id, name, date_of_joining FROM users WHERE id = $1
    ),
    date_series AS (
        SELECT generate_series((${startDate})::date,
        (${endDate})::date, 
        '1 day'::interval
        )::date AS report_date
    )
    SELECT 
        u.id AS user_id,
        u.name AS user_name,
        TO_CHAR(ds.report_date, 'DD-Mon-YYYY') AS date,
        COALESCE(TO_CHAR(a.first_punch_in, 'HH12:MI AM'), '-') AS first_punch_in,
        COALESCE(TO_CHAR(a.last_punch_out, 'HH12:MI AM'), '-') AS last_punch_out,
        COALESCE(a.total_minutes, 0) AS total_minutes,
        CASE 
            WHEN a.status IS NOT NULL THEN a.status
            WHEN ds.report_date < u.date_of_joining THEN 'Absent'
            ELSE 'Absent' 
        END AS status
    FROM date_series ds
    CROSS JOIN user_info u
    LEFT JOIN attendance a ON a.date = ds.report_date AND a.user_id = u.id
    WHERE u.date_of_joining <= ${endDate} 
    ORDER BY ds.report_date ASC;
  `;

  const result = await db.query(query, [employee_id]);
  return result.rows;
};