// const express = require('express')
// const router = express.Router()

// const userRoutes = require('../Routes/user.routes')

// router.use('/users',userRoutes)
// router.use('/companies',)
// router.use('/leave',)
// router.use('/company',)
// router.use('/managment',)

const express = require('express');
const router = express.Router();

// Import individual route files
const userRoutes = require('./user.routes');        // make sure file exists
const companyRoutes = require('./company.routes');  // make sure file exists
// const leaveRoutes = require('./leave.routes');      // create later if needed
// const managementRoutes = require('./management.routes'); // create later if needed

// Use routes
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
// router.use('/leave', leaveRoutes);
// router.use('/management', managementRoutes);

module.exports = router;
