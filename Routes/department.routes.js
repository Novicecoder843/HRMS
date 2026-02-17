const express = require("express");
const router = express.Router();
const departmentController = require("../Controller/department.controller");
const {
     ValidateCreateDepartment,
     ValidateReadDepartment,
     ValidateUpdateDepartment,
     ValidateDeleteDepartment
} = require("../middlewares/department_middleware")

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         company_id:
 *           type: integer
 *     CreateDepartmentRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         company_id:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/department/create:
 *   post:
 *     summary: Create a new department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *     responses:
 *       201:
 *         description: Department created successfully
 */
router.post("/create", ValidateCreateDepartment, departmentController.createDepartment);

/**
 * @swagger
 * /api/v1/department/all:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all departments
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
 *                     $ref: '#/components/schemas/Department'
 */
router.get("/all", ValidateReadDepartment, departmentController.getAllDepartment);

/**
 * @swagger
 * /api/v1/department/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Department]
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
 *         description: Department details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Department'
 */
router.get("/:id", ValidateReadDepartment, departmentController.getDepartmentById);

/**
 * @swagger
 * /api/v1/department/{id}:
 *   put:
 *     summary: Update department by ID
 *     tags: [Department]
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
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *     responses:
 *       200:
 *         description: Department updated successfully
 */
router.put("/:id", ValidateUpdateDepartment, departmentController.updateDepartment);

/**
 * @swagger
 * /api/v1/department/{id}:
 *   delete:
 *     summary: Delete department by ID
 *     tags: [Department]
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
 *         description: Department deleted successfully
 */
router.delete("/:id", ValidateDeleteDepartment, departmentController.deleteDepartment);

module.exports = router;
