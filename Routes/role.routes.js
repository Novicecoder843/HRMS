const express = require("express");
const router = express.Router();
const roleController = require("../Controller/role.controller");

const {
     ValidateCreateRole,
     ValidateReadRole,
     ValidateUpdateRole,
     ValidateDeleteRole,
} = require("../middlewares/role_middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *     CreateRoleRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/v1/role/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleRequest'
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post("/create", ValidateCreateRole, roleController.createRole);

/**
 * @swagger
 * /api/v1/role/all:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 */
router.get(
     "/all",
     roleController.getAllRoles
);

/**
 * @swagger
 * /api/v1/role/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 */
router.get(
     "/:id",
     ValidateReadRole,
     roleController.getRoleById
);

/**
 * @swagger
 * /api/v1/role/{id}:
 *   put:
 *     summary: Update role by ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.put(
     "/:id",
     ValidateUpdateRole,
     roleController.updateRole
);

/**
 * @swagger
 * /api/v1/role/{id}:
 *   delete:
 *     summary: Delete role by ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role deleted successfully
 */
router.delete(
     "/:id",
     ValidateDeleteRole,
     roleController.deleteRole
);

module.exports = router;
