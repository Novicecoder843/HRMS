const attendanceModel = require("../models/attendanceModel");

// 🔥 FORMAT DATE (UTC → IST)
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });
};

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

    const formatted = data.map((item) => ({
      ...item,
      check_in: formatDate(item.check_in),
      check_out: formatDate(item.check_out),
      date: formatDate(item.date)
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 👥 ALL ATTENDANCE (RBAC)
exports.getAllAttendance = async (req, res) => {
  try {
    const { company_id } = req.user;

    const data = await attendanceModel.getCompanyAttendance(company_id);

    const formatted = data.map((item) => ({
      ...item,
      check_in: formatDate(item.check_in),
      check_out: formatDate(item.check_out),
      date: formatDate(item.date)
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};