const attendanceService = require("../Service/attendance.service");

exports.punchAction = async (req, res) => {
     try {
          const userId = req.user?.id || req.user?.employee_id;

          const type = req.body.type || req.body.punch_type; // flexible

          const result = await attendanceService.processPunch(userId, type);

          res.status(200).json({
               success: true,
               message: `Successfully ${result.punch_type}`,
               data: result
          });
     } catch (error) {
          res.status(400).json({
               success: false,
               message: error.message
          });
     }
};

// 2. GET ATTENDANCE REPORt
exports.myReport = async (req, res) => {
     try {

          const userId = req.query.user_id ? req.query.user_id.toString().trim() : null;

          if (!userId) {
               return res.status(400).json({
                    success: false,
                    message: "user_id is required in the query string (e.g., ?user_id=17)"
               });
          }

          const data = await attendanceService.getDetailedAttendance(userId);

          // Always good to return a count so you know if data is truly empty
          res.json({
               success: true,
               results: data.length,
               data
          });

     } catch (err) {
          console.error("Controller Error:", err);
          res.status(500).json({ success: false, error: err.message });
     }
};

