const express = require("express");
const router = express.Router();
const userController = require("../Controller/user.controller");
const {
  validateCreateUser,
  validateUpdateUser,
  validateLoginUser,
  validateGetUserById,
  validateBulkInsertUsers,
  validateSoftDeleteUser,
} = require("../middlewares/validation.middlewares");

const { authenticate } = require("../middlewares/auth.middlewares");

// Create User with validation
router.post("/adduser", validateCreateUser, userController.createUser);

//Login
router.post("/login", validateLoginUser, userController.loginUser);

//Creat User
// router.post("/adduser",userController.createUser);

// router.use(authenticate);

//Read All
router.get("/getall", userController.getAllUsers);

//Read by id path params, query params
router.get('/getuser/:id', validateGetUserById, userController.getUserById);

//Update user by id
router.put("/updateuser/:id", validateUpdateUser, userController.updateUser);

//Delete user
router.delete("/delete/:id", userController.deleteUser);

//bulk-insert
router.post("/bulk-insert", validateBulkInsertUsers, userController.bulkInsertUsers);

//soft delete user
router.delete("/softdelete/:id", validateSoftDeleteUser, userController.softDeleteUser);

module.exports = router;
