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
          // Use user_id from query if it exists, otherwise from token
          const userId = req.query.user_id || req.user?.id;
          const { filterType, page, limit, month, year } = req.query;

          console.log("Filter Received:", filterType); // Should print 'last7days'

          const data = await attendanceService.getDetailedAttendance(
               userId,
               filterType,
               parseInt(page) || 1,
               parseInt(limit) || 10,
               month,
               year
          );

          res.json({ success: true, data });
     } catch (err) {
          res.status(500).json({ success: false, error: err.message });
     }
};
