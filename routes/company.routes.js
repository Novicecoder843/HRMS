const express = require('express');
const router = express.Router();
const companyController = require('../controller/company.controller');
const authMiddleware = require('../middleware/auth.middleware'); // import auth middleware

// Public routes
router.post('/signup', companyController.signupCompany);
router.post('/login', companyController.loginCompany);

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});

module.exports = router;
