const express = require("express");
const router = express.Router();
const desigController = require("../controllers/designationController");
const { protect } = require("../middleware/authMiddleware"); 

// ✅ CREATE DESIGNATION
router.post("/create", protect, desigController.createDesignation);

// ✅ GET DESIGNATIONS BY DEPARTMENT
router.get("/department/:department_id", protect, desigController.getDesignations);

// ✅ GET SINGLE DESIGNATION
router.get("/:id", protect, desigController.getDesignationById);

// ✅ UPDATE DESIGNATION
router.put("/:id", protect, desigController.updateDesignation);

// ✅ DELETE DESIGNATION
router.delete("/:id", protect, desigController.deleteDesignation);

module.exports = router;