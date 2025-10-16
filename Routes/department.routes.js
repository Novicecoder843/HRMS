const express = require('express')
const router = express.Router()

const departmentController = require('../Controller/department.cotroller')

router.post('/createDepartment',departmentController.createDepartment)