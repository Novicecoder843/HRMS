const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const { verifyToken, verifyUser } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const {createUserSchema,loginUserSchema,updateUserSchema} = require("../validations/userValidation");


// CREATE FIRST ADMIN (Company Token)
router.post("/create-admin", verifyToken,userController.createAdmin);

// LOGIN USER
router.post("/login",validate(loginUserSchema), userController.loginUser);

// 🔒 RBAC (USER TOKEN)

// CREATE USER (Admin / HR)
router.post("/create",verifyToken,verifyUser,validate(createUserSchema),checkPermission("CREATE_USER"),userController.createUser);

// GET ALL USERS
router.get("/",verifyToken,verifyUser,checkPermission("VIEW_USER"),userController.getUsers);

// GET USER BY ID
router.get("/:id",verifyToken,verifyUser,checkPermission("VIEW_USER"),userController.getUserById
);

// UPDATE USER
router.put("/:id",verifyToken,verifyUser,validate(updateUserSchema),checkPermission("UPDATE_USER"),userController.updateUser);

// DELETE USER
router.delete("/:id",verifyToken, verifyUser,checkPermission("DELETE_USER"),userController.deleteUser);

module.exports = router;