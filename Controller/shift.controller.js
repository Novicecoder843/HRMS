const shiftService = require("../Service/shift.service");


// 1. Create a New Shift
exports.createShift = async (req, res) => {
     try {
          const result = await shiftService.createShift(req.body);
          res.status(201).json({ success: true, data: result });
     } catch (error) {
          res.status(500).json({ success: false, message: error.message });
     }
};

// 2. Get All Shifts (with Pagination)
exports.getShifts = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const companyId = req.user.company_id;

          const data = await shiftService.getAllShifts(companyId, page, limit);
          res.status(200).json({ success: true, ...data });
     } catch (error) {
          res.status(500).json({ success: false, message: error.message });
     }
};

// 3. Assign Shift to User
exports.assignUserShift = async (req, res) => {
     try {
          const { user_id, shift_id } = req.body;
          const result = await shiftService.assignShift(user_id, shift_id);
          res.status(200).json({ success: true, message: "Shift assigned successfully", data: result });
     } catch (error) {
          res.status(500).json({ success: false, message: error.message });
     }
};

// 4. Get specific user shift
exports.getUserShift = async (req, res) => {
     try {
          const userId = req.params.id;
          const result = await shiftService.getUserCurrentShift(userId);
          if (!result) return res.status(404).json({ success: false, message: "No shift assigned" });

          res.status(200).json({ success: true, data: result });
     } catch (error) {
          res.status(500).json({ success: false, message: error.message });
     }
};