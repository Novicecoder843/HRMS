
const express = require("express");
const router = express.Router();

const userController = require("../Controller/user.controller");
const {
     ValidateCreateUser,
     ValidateUpdateUser,
} = require("../middlewares/user_middleware");

// CREATE USER
router.post("/adduser", ValidateCreateUser, userController.createUser);

// LOGIN
router.post("/login", userController.loginUser);

// CHANGE PASSWORD
router.post("/change-password", userController.changePassword);

// READ ALL USERS
router.get("/all", userController.getAllUsers);

// READ USER BY ID
router.get("/getuser/:id", userController.getUserById);

// UPDATE USER
router.put(
     "/updateuser/:id",
     ValidateUpdateUser,
     userController.UpdateUser
);

// SOFT DELETE
router.delete("/delete/:id", userController.softDeleteuser);

module.exports 