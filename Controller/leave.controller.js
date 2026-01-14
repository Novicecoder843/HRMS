const { success } = require("zod");
const leaveService = require("../Service/leave.service");

exports.addLeaveType = async (req, res) => {
  try {
    const result = await leaveService.createLeaveTypeService(req.body);

    return res.status(201).json({
      success: true,
      meassage: "Leave Type added successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.assignLeaveBalance = async (req, res) => {
  try {
    const result = await leaveService.assignLeaveBalanceService(req.body);
    return res.status(200).json({
      success: true,
      message: "Leave Balance assigned successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.applyLeave = async (req, res) => {
  try {
    const result = await leaveService.applyLeaveService(req.body);

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully, waiting for approval.",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body; 
        const result = await leaveService.updateLeaveStatusService(requestId, status);
        
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
