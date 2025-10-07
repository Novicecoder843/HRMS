const express = require('express')
const router = express.Router()

const userRoutes = require('../Routes/user.rotes')

router.use('/users',userRoutes)
router.use('/companies',)
router.use('/leave',)
router.use('/company',)
router.use('/managment',)