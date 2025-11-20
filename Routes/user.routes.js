const express = require("express");
const router = express.Router();
const userController = require("../Controller/user.controller");

//Creat User
router.post("/adduser", userController.createUser);

//Read All
router.get('/all',userController.getAllUsers);

//Read by id path params, query params
router.get('/getuser/:id',userController.getUserById)

//Update user by id
router.put('/updateuser/:id',userController.updateUser)

//Delete user
router.delete('/delete/:id',userController.deleteUser) 

//bulk-insert
router.post("/bulk-insert",userController.bulkInsertUsers)

module.exports = router;
