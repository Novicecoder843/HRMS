const leaveService = require("../Service/leave.service");

exports.addLeaveType = async (req, res) => {
     try {
          const result = await leaveService.addLeaveType(req.body);
          res.status(201).json({
               success: true,
               data: result
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};

exports.assignLeaveBalance = async (req, res) => {
     try {
          // Function name matching with Service
          const result = await leaveService.assignLeaveBalance(req.body);
          res.status(201).json({
               success: true,
               data: result
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};
exports.applyLeave = async (req, res) => {
     try {
          // 1. Ensure the user is authenticated
          if (!req.user) {
               return res.status(401).json({ success: false, message: "Authentication required." });
          }

          const { from_date, to_date, half_day_type } = req.body;

          // 2. Calculate total days
          let total_days = 0;
          if (half_day_type && half_day_type !== 'none') {
               total_days = 0.5;
          } else {
               const start = new Date(from_date);
               const end = new Date(to_date);
               // Simple difference calculation + 1 to include both start/end dates
               total_days = (end - start) / (1000 * 60 * 60 * 24) + 1;
          }

          // 3. Prepare data for service
          const leaveData = {
               ...req.body,
               // Use fallback in case your JWT middleware uses 'id' vs 'employee_id'
               user_id: req.user.employee_id || req.user.id,
               total_days
          };

          const result = await leaveService.applyLeave(leaveData);

          res.status(200).json({
               success: true,
               data: result
          });
     } catch (error) {
          res.status(400).json({
               success: false,
               message: error.message
          });
     }
};
exports.updateLeaveStatus = async (req, res) => {
     try {
          const { id, status } = req.body; // id is leave_application id, status is 'Approved' or 'Rejected'

          if (!['Approved', 'Rejected'].includes(status)) {
               return res.status(400).json({
                    success: false,
                    message: "Invalid status"
               });
          }

          const result = await leaveService.updateLeaveStatus(id, status);
          res.status(200).json({
               success: true,
               message: result.message
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};