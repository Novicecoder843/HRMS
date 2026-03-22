const router = require("express").Router();
const roleController = require("../controllers/roleController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Create role
router.post("/createroles", protect, roleController.createRole);

// ✅ Get all roles
router.get("/getroles", protect, roleController.getRoles);

// ✅ Get role by ID or name
router.get("/:value", protect, roleController.getRole);

module.exports = router;