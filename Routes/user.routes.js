const express = require('express');
const router = express.Router();

// Dummy controller
const userController = {
  addUser: (req, res) => res.send("Add User"),
  getUsers: (req, res) => res.send("Get Users")
};

// Routes
router.post('/add', userController.addUser);
router.get('/all', userController.getUsers);

module.exports = router;
