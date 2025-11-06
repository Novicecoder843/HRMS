const express = require('express')
const router = express.Router()

const userController = require('../Controller/user.controller')

router.post('/adduser',userController.createUser)


module.exports = router;