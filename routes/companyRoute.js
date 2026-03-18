const router = require("express").Router();

const companyController = require("../controllers/companyController");

// ✅ MUST IMPORT FROM authMiddleware
const { protect } = require("../middleware/authMiddleware");

router.post("/register", companyController.registerCompany);
router.post("/login", companyController.loginCompany);
router.get("/profile", protect, companyController.getCompanyProfile);

module.exports = router;