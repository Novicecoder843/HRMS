const express = require("express");
const router = express.Router();
const shiftController = require("../Controller/shift.controller"); // Controller create karna hoga
const { authenticate } = require("../middlewares/auth_middleware");

// 1. CREATE SHIFT (General, Morning, Night)

router.post("/create", authenticate, shiftController.createShift);

// 2. GET ALL SHIFTS (With Pagination)
// URL: /api/shift/all?page=1&limit=10
router.get("/all", authenticate, shiftController.getShifts);

// 3. ASSIGN SHIFT TO USER

router.post("/assign", authenticate, shiftController.assignUserShift);

// 4. GET USER'S CURRENT SHIFT

router.get("/user/:id", authenticate, shiftController.getUserShift);

module.exports = router;