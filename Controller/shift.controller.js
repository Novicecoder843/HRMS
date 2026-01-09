const { success } = require("zod");
const shiftService = require("../Service/shift.service");

exports.createShift = async (req, res) => {
  try {
    const { company_id } = req.user;
    const shiftData = { ...req.body, company_id };

    const result = await shiftService.createShift(shiftData);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    const { company_id } = req.user;
    const result = await shiftService.getShiftByCompany(company_id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
