const attendanceModel = require("../models/attendanceModel");

// ✅ CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const { user_id, company_id } = req.user;

    const existing = await attendanceModel.getTodayAttendance(user_id);

    if (existing) {
      return res.status(400).json({
        message: "Already checked in today ❌"
      });
    }

    await attendanceModel.checkIn(user_id, company_id);

    res.json({ message: "Check-in successful ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const { user_id } = req.user;

    const existing = await attendanceModel.getTodayAttendance(user_id);

    if (!existing) {
      return res.status(400).json({
        message: "Check-in first ❌"
      });
    }

    if (existing.check_out) {
      return res.status(400).json({
        message: "Already checked out ❌"
      });
    }

    await attendanceModel.checkOut(user_id);

    res.json({ message: "Check-out successful ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📄 MY ATTENDANCE
exports.getMyAttendance = async (req, res) => {
  try {
    const { user_id } = req.user;

    const data = await attendanceModel.getMyAttendance(user_id);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 👥 COMPANY / TEAM ATTENDANCE (RBAC)
exports.getAllAttendance = async (req, res) => {
  try {
    const { company_id } = req.user;

    const data = await attendanceModel.getCompanyAttendance(company_id);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};