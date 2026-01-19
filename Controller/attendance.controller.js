
const { success } = require("zod");
const attendanceService = require("../Service/attendance.service");

// create attendance

exports.createAttendance = async (req, res) => {
     try {
          const { attendance_date, status, check_in, check_out, remarks } = req.body;
          const result = await attendanceService.createAttendance({
               user_id: req.id,
               attendance_date,
               status,
               check_in,
               check_out,
               remarks
          });
          res.status(200).json({
               success: true,
               message: "Attendance created successfully",
               data: result ,
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
          
};

// Read All:-

exports.getAllAttendance = async (req, res) => {
     try {
          const result = await attendanceService.findAll();
          res.status(200).json({
               success: true,
               data: result,
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
          });
     }
          
     
};

//Read by Id

exports.getAttendanceById = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await attendanceService.getAttendanceById(id);
          if (!resuit || result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Attendance not found",
                    data: [],
               })
          }
          res.status(200).json({
               success: true,
               message: "attendance fetched successfully",
               data: result,
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};

// Update

exports.updateAttendance = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await attendanceService.updateAttendance(id, req.body);

          if (!result || result.length === 0) {
               return res.status(400).json({
                    success: false,
                    message: "Attendance not found",
                    data: [],
               });
          }

          res.status(200).json({
               success: true,
               message: "Attendance updated successfully",
               data: [],
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};


//Delete

exports.deleteAttendance = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await attendanceService.deleteAttendance(id);

          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Attendance not found",
                    data: [],
               })

          }
          res.status(200).json({
               success: false,
               message: "Attendance delete successfully",
               data: [],
          })

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};
