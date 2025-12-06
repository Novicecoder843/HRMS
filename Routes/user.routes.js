const express = require("express");
const router = express.Router();
const userController = require("../Controller/user.controller");
const{validateCreateUser,validateUpdateUser}=require("../middlewares/validation.middlewares")
const {authenticate}=require ("../middlewares/auth.middlewares")

// Create User with validation
router.post("/adduser",validateCreateUser,userController.createUser)

//Creat User
// router.post("/adduser",userController.createUser);

//Read All
router.get('/getall',authenticate,userController.getAllUsers);

//Read by id path params, query params
router.get('/getuser/:id',userController.getUserById)

//Update user by id
router.put('/updateuser/:id',authenticate,validateUpdateUser,userController.updateUser)

//Delete user
router.delete('/delete/:id',userController.deleteUser) 

//bulk-insert
router.post("/bulk-insert",userController.bulkInsertUsers)

//Login
router.post("/login",userController.loginUser);

//soft delete user
router.delete("/softdelete/:id",userController.softDeleteUser);

module.exports = router;
