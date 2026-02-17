const express = require("express");
const router = express.Router();
const attendanceController = require("../Controller/attendance.controller");
const { authenticate } = require("../middlewares/auth_middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     PunchRequest:
 *       type: object
 *       required:
 *         - action
 *       properties:
 *         action:
 *           type: string
 *           enum: [in, out]
 *           description: Punch action type
 *     AttendanceRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         punchIn:
 *           type: string
 *           format: date-time
 *         punchOut:
 *           type: string
 *           format: date-time
 *         date:
 *           type: string
 *           format: date
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/attendance/punch:
 *   post:
 *     summary: Punch in or out
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PunchRequest'
 *     responses:
 *       200:
 *         description: Punch action successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.post("/punch", authenticate, attendanceController.punchAction);

/**
 * @swagger
 * /api/v1/attendance/my-report:
 *   get:
 *     summary: Get my attendance report
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AttendanceRecord'
 *       401:
 *         description: Unauthorized
 */
router.get("/my-report", authenticate, attendanceController.myReport);

module.exports = router;