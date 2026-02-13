const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const userIdAccessMiddleware = require('../middleware/user.middleware');

router.use(authMiddleware);

router.post('/',roleMiddleware(['superadmin', 'company_admin', 'hr']),userController.create);
router.get('/',roleMiddleware(['superadmin', 'company_admin', 'hr']),userController.getAll);
router.get('/:id',roleMiddleware(['superadmin', 'company_admin', 'hr', 'employee']),userIdAccessMiddleware,userController.getById);
router.put('/:id',roleMiddleware(['superadmin', 'company_admin', 'hr']),userIdAccessMiddleware,userController.update);
router.delete('/:id',roleMiddleware(['superadmin', 'company_admin']),userIdAccessMiddleware,userController.delete );

module.exports = router;
