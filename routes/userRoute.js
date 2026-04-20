const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const {createUserSchema,loginUserSchema} = require("../validations/userValidation");


// 🔥 CREATE USER
router.post("/create",verifyToken,validate(createUserSchema),userController.createUser);

// 🔐 LOGIN USER
router.post("/login",verifyToken,validate(loginUserSchema),userController.loginUser);

// 📄 GET ALL USERS
router.get("/",verifyToken,userController.getUsers);

// 🔍 GET USER BY ID
router.get("/:id",verifyToken,userController.getUserById);

// ✏️ UPDATE USER
router.put("/:id",verifyToken,userController.updateUser);

// ❌ DELETE USER
router.delete("/:id",verifyToken,userController.deleteUser);

module.exports = router;