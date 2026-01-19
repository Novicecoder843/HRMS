const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth_middleware");
const userController = require("../Controller/user.controller");
 
const uploads = require("../middlewares/upload_middleware");
const multer = require('multer');
const upload=multer({dest:'upload/'})



router.post('/upload-users', upload.single('file'), userController.uploadUsers);


router.get("/download-detailed",userController.downloadUsersDetailedExcel);




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
     ValidateReadUser,
     userController.getAllUsers
);


// ================= UPDATE USER =================

router.put(
     "/user/:id",
     ValidateUpdateUser,
     userController.UpdateUser
);


// ================= DELETE USER =================

router.delete(
     "/user/:id",
     ValidateDeleteUser,
     userController.deleteUser
);


// ================= SOFT DELETE =================

router.delete("/user/soft/:id", userController.softDeleteuser);

module.exports = router;
