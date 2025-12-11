const express = require('express');
const router = express.Router();
const userController = require("../Controller/user.controller");

//Creat User
router.post("/adduser", validateUser, userController.createUser);
router.post("/login", userController.loginUser);
router.post("/change-password", userController.changePassword);

//Read All
// router.get('/all', userController.getAllUsers);
router.get('/all', userController.getAllUsers);


//Read by id path params, query params
router.get('/getuser/:id', userController.getUserById)

//Update user by id
router.put('/updateuser/:id', userController.UpdateUser)

//Delete user
router.delete('/delete/:id', userController.softDeleteuser)
// router.delete('/delete/:id', userController.deleteUser) 




module.exports = router