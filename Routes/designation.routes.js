const express = require("express");
const router = express.Router();

const designationController = require("../Controller/designation.controller1");

const {
     ValidateCreateDesignation,
     ValidateReadDesignation,
     ValidateUpdateDesignation,
     ValidateDeleteDesignation,
} = require("../middlewares/designation_middleware")

/**
 * @swagger
 * components:
 *   schemas:
 *     Designation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         department_id:
 *           type: integer
 *     CreateDesignationRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         department_id:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/designation/create:
 *   post:
 *     summary: Create a new designation
 *     tags: [Designation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDesignationRequest'
 *     responses:
 *       201:
 *         description: Designation created successfully
 */
router.post("/create", ValidateCreateDesignation, designationController.createDesignation);

/**
 * @swagger
 * /api/v1/designation/all:
 *   get:
 *     summary: Get all designations
 *     tags: [Designation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all designations
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
 *                     $ref: '#/components/schemas/Designation'
 */
router.get("/all", ValidateReadDesignation, designationController.getAllDesignation);

/**
 * @swagger
 * /api/v1/designation/{id}:
 *   get:
 *     summary: Get designation by ID
 *     tags: [Designation]
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
 *         description: Designation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Designation'
 */
router.get("/:id", ValidateReadDesignation, designationController.getDesignationById);

/**
 * @swagger
 * /api/v1/designation/{id}:
 *   put:
 *     summary: Update designation by ID
 *     tags: [Designation]
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
 *             $ref: '#/components/schemas/CreateDesignationRequest'
 *     responses:
 *       200:
 *         description: Designation updated successfully
 */
router.put("/:id", ValidateUpdateDesignation, designationController.updateDesignation);

/**
 * @swagger
 * /api/v1/designation/{id}:
 *   delete:
 *     summary: Delete designation by ID
 *     tags: [Designation]
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
 *         description: Designation deleted successfully
 */
router.delete("/:id", ValidateDeleteDesignation, designationController.deleteDesignation);

module.exports = router;
