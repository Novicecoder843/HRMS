const { success } = require("zod");
const attendanceService = require("../Service/attendance.service");

exports.punchIn = async (req, res) => {
  try {

    console.log("FULL DECODED USER FROM TOKEN:", req.user);

    const employee_id = req.user.id;
    const shift_id = req.user.shift_id;

    if (!shift_id) {
      return res.status(400).json({
        success: false,
        message: "Shift not assigned yet",
      });
    }

    const data = await attendanceService.punchInService(employee_id, shift_id);
    return res.status(200).json({
      success: true,
      message: "Punch In Successful",
      data,
      user_id: employee_id
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.punchOut = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const data = await attendanceService.punchOutService(employee_id);
    res.status(200).json({
      success: true,
      message: "Punch Out Successful",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
