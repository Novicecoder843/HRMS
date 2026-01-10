const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth_middleware");

const userController = require("../Controller/user.controller");

const {
     ValidateCreateUser,
     ValidateUpdateUser,
     ValidateReadUser,
     ValidateDeleteUser
} = require("../middlewares/user_middleware");

// ================= CREATE USER =================

router.post("/adduser", ValidateCreateUser, userController.createUser);

// ================= LOGIN =================

router.post("/login", userController.loginUser);

// ================= CHANGE PASSWORD =================

router.post("/change-password", userController.changePassword);

// ================= READ ALL USERS =================

router.get("/all", userController.getAllUsers);

// ================= READ USER BY ID =================


router.get(
     "/all",
     authenticate,
     ValidateReadUser,
     userController.getAllUsers
);


// ================= UPDATE USER =================

router.put(
     "/user/:id",
     authenticate,
     ValidateUpdateUser,
     userController.UpdateUser
);


// ================= DELETE USER =================

router.delete(
     "/user/:id",
     authenticate,
     ValidateDeleteUser,
     userController.deleteUser
);


// ================= SOFT DELETE =================

router.delete("/user/soft/:id", userController.softDeleteuser);

module.exports = router;
