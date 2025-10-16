const express = require('express')
const router = express.Router()

const userRoutes = require('../Routes/user.rotes')

router.use('/users',userRoutes)
router.use('/companies',)
router.use('/departments',)
router.use('/designation',)