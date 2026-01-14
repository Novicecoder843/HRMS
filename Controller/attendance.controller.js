const { success } = require("zod");
const attendanceService = require("../Service/attendance.service");
const logger= require("../config/logger");

exports.punchIn = async (req, res) => {
  try {

    logger.info(`Punch-In attempt: User ID ${req.user.id}`);

    // console.log("FULL DECODED USER FROM TOKEN:", req.user);

    const employee_id = req.user.id;
    const shift_id = req.user.shift_id;

    if (!shift_id) {

      logger.warn(`Punch-In failed: No shift assigned for User ID ${employee_id}`);
      return res.status(400).json({
        success: false,
        message: "Shift not assigned yet",
      });
    }

    const data = await attendanceService.punchInService(employee_id, shift_id);
    logger.info(`Punch-In Successful: User ID ${employee_id}`);


    return res.status(201).json({
      success: true,
      message: "Punch In Successful",
      data,
      user_id: employee_id,
    });
  } catch (err) {

    logger.error(`Punch-In Error: ${err.message} | User: ${req.user.id}`)
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.punchOut = async (req, res) => {
  try {
    const employee_id = req.user.id;
    logger.info(`Punch-Out attempt: User ID ${employee_id}`);

    const data = await attendanceService.punchOutService(employee_id);
    logger.info(`Punch-Out Successful: User ID ${employee_id}`);

    res.status(200).json({
      success: true,
      message: "Punch Out Successful",
      data,
    });
  } catch (error) {
    logger.error(`Punch-Out Exception: ${error.message} | User: ${req.user.id}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAttendanceReport = async (req, res) => {
  try {
    const { userid, date } = req.query;
    logger.info(`Report Request: User ${userid} for Month/Year ${date}`);

    const report = await attendanceService.getReportService(userid, date);
    if (report.length === 0) {
      logger.info(`Report Empty: No data for User ${userid} in ${date}`);
      return res.status(404).json({
        success: false,
        message: "No record found. The user had not joined in this period.",
      });
    }

    res.status(200).json({
      success: true,
      count: report.length,
      data: report,
    });
  } catch (err) {
    logger.error(`Report API Failed: ${err.message} | SearchParams: ${JSON.stringify(req.query)}`);
    res.status(500).json({ success: false, message: err.message });
  }
};
