const express = require("express");
const router = express.Router();
const shiftController = require("../Controller/shift.controller");
const { authenticate } = require("../middlewares/auth_middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Shift:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         start_time:
 *           type: string
 *           format: time
 *         end_time:
 *           type: string
 *           format: time
 *         description:
 *           type: string
 *     CreateShiftRequest:
 *       type: object
 *       required:
 *         - name
 *         - start_time
 *         - end_time
 *       properties:
 *         name:
 *           type: string
 *         start_time:
 *           type: string
 *           format: time
 *         end_time:
 *           type: string
 *           format: time
 *         description:
 *           type: string
 *     AssignShiftRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - shift_id
 *       properties:
 *         user_id:
 *           type: integer
 *         shift_id:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/shift/create:
 *   post:
 *     summary: Create a new shift (General, Morning, Night)
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShiftRequest'
 *     responses:
 *       201:
 *         description: Shift created successfully
 */
router.post("/create", authenticate, shiftController.createShift);

/**
 * @swagger
 * /api/v1/shift/all:
 *   get:
 *     summary: Get all shifts with pagination
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of shifts
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
 *                     $ref: '#/components/schemas/Shift'
 */
router.get("/all", authenticate, shiftController.getShifts);

/**
 * @swagger
 * /api/v1/shift/assign:
 *   post:
 *     summary: Assign shift to user
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignShiftRequest'
 *     responses:
 *       200:
 *         description: Shift assigned successfully
 */
router.post("/assign", authenticate, shiftController.assignUserShift);

/**
 * @swagger
 * /api/v1/shift/user/{id}:
 *   get:
 *     summary: Get user's current shift
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's shift details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Shift'
 */
router.get("/user/:id", authenticate, shiftController.getUserShift);

module.exports = router;