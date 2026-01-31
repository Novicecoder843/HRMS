const db = require("../config/db");

//punch_in and punch_out

exports.processPunch = async (userId, requestedType) => {
     const today = new Date().toISOString().split("T")[0];

     // 1. Get/Ensure Master Record
     let masterRes = await db.query(
          `SELECT id FROM attendance_master WHERE user_id = $1 AND date::date = $2`,
          [userId, today]
     );

     let masterId;
     if (masterRes.rows.length === 0) {
          const insertMaster = await db.query(
               `INSERT INTO attendance_master (user_id, date, status) VALUES ($1, $2, 'Present') RETURNING id`,
               [userId, today]
          );
          masterId = insertMaster.rows[0].id;
     } else {
          masterId = masterRes.rows[0].id;
     }

     // 2. GET LAST STATUS (IMPORTANT)
     const lastPunch = await db.query(
          `SELECT punch_type FROM attendance_history 
         WHERE attendance_id = $1 ORDER BY punch_time DESC LIMIT 1`,
          [masterId]
     );

     const lastStatus = lastPunch.rows[0]?.punch_type;

     // 3. VALIDATION - Stop duplicates
     if (requestedType === 'punch-in' && lastStatus === 'punch-in') {
          throw new Error("Pehle se 'Punch In' hai. Please 'Punch Out' karein.");
     }
     if (requestedType === 'punch-out' && (lastStatus === 'punch-out' || !lastStatus)) {
          throw new Error("'Punch Out' karne ke liye pehle 'Punch In' hona zaroori hai.");
     }

     // Agar requestedType nahi bheja toh toggle karein (safely)
     const finalType = requestedType || (lastStatus === 'punch-in' ? 'punch-out' : 'punch-in');

     // 4. INSERT HISTORY
     await db.query(
          `INSERT INTO attendance_history (attendance_id, punch_type, punch_time, date)
         VALUES ($1, $2, NOW(), $3)`,
          [masterId, finalType, today]
     );

     if (finalType === 'punch-out') {
          await exports.updateTotalHours(attendanceId);
     }

     return { success: true, punch: finalType };
};


exports.updateTotalHours = async (masterId) => {
     const result = await db.query(
          `WITH pairs AS (
            SELECT punch_time,
                   LEAD(punch_time) OVER (ORDER BY punch_time) AS next_punch,
                   punch_type
            FROM attendance_history
            WHERE attendance_id = $1
        )
        SELECT COALESCE(
            SUM(EXTRACT(EPOCH FROM (next_punch - punch_time)) / 3600),
            0
        ) AS hours
        FROM pairs
        WHERE punch_type = 'punch-in' AND next_punch IS NOT NULL`,
          [masterId]   // ONLY ONE PARAM
     );

     const hours = Number(result.rows[0].hours).toFixed(2);

     await db.query(
          `UPDATE attendance_master
         SET total_hours = $1
         WHERE id = $2`,
          [hours, masterId]
     );
};


exports.getMergedattendance = async (userId) => {
     const query = `
        SELECT 
            u.email, 
            u.mobile_no, 
            m.date, 
            m.status, 
            m.total_hours,
            COALESCE(
                json_agg(
                    json_build_object(
                        'type', h.punch_type,
                        'time', h.punch_time
                    )
                    ORDER BY h.punch_time ASC
                ) FILTER (WHERE h.id IS NOT NULL),
                '[]'
            ) AS punch_logs
        FROM attendance_master m
        INNER JOIN users u ON m.user_id = u.id
        LEFT JOIN attendance_history h 
            ON m.id = h.attendance_id
            AND m.date = h.date
        WHERE m.user_id = $1
        GROUP BY u.id, m.id
        ORDER BY m.date DESC
    `;

     const result = await db.query(query, [userId]);
     return result.rows;
};



// // Detailed Report


exports.getDetailedAttendance = async (userId) => {
     const query = `
        SELECT 
            u.email,
            u.mobile,
            m.id AS attendance_id, -- Changed from master_id to attendance_id
            m.date,
            m.status,
            m.total_hours,
            COALESCE(
                (
                    SELECT json_agg(logs)
                    FROM (
                        /* DISTINCT ON ensure karta hai ki ek hi second/time par duplicate logs na aayein */
                        SELECT DISTINCT ON (h.punch_time, h.punch_type)
                            h.punch_type AS type,
                            TO_CHAR(h.punch_time, 'HH12:MI AM') AS time
                        FROM attendance_history h
                        WHERE h.attendance_id = m.id
                        ORDER BY h.punch_time ASC
                    ) logs
                ),
                '[]'
            ) AS punch_logs
        FROM attendance_master m
        JOIN users u ON u.employee_id = m.user_id   
        WHERE m.user_id = $1
        ORDER BY m.date DESC;
    `;

     const result = await db.query(query, [userId]);
     return result.rows;
};