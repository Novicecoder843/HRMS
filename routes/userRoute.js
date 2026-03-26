const router = require("express").Router();
const userController = require("../controllers/userController");

// 🔐 Middleware
const { protect } = require("../middleware/authMiddleware");

// ✅ USER LOGIN
router.post("/login", userController.loginUser);

// ================= PROTECTED ROUTES =================

// ✅ CREATE USER (company creates user)
router.post("/create", protect, userController.createUser);

// ✅ GET ALL USERS (company-wise)
router.get("/all", protect, userController.getAllUsers);

// ✅ GET USER BY ID
router.get("/:id", protect, userController.getUserById);

// ✅ UPDATE USER
router.put("/update/:id", protect, userController.updateUser);

// ✅ DELETE USER
router.delete("/delete/:id", protect, userController.deleteUser);


module.exports = router;