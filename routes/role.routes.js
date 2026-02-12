const express = require('express');
const router = express.Router();
const roleController = require('../controller/role.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Only superadmin can manage roles
router.post('/', roleMiddleware('superadmin'), roleController.createRole);
router.get('/:id', roleMiddleware('superadmin'), roleController.getRoleById);
router.get('/', roleMiddleware('superadmin'), roleController.getAllRoles);
router.put('/:id', roleMiddleware('superadmin'), roleController.updateRole);
router.delete('/:id', roleMiddleware('superadmin'), roleController.deleteRole);


module.exports = router;
    