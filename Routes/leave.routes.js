const express = require("express");
const router = express.Router();
const leaveController = require("../Controller/leave.controller");

const {
     validateApplyLeave,
     validateAssignBalance,
     validateLeaveType
} = require("../middlewares/leave_middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     LeaveType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     LeaveBalance:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         leave_type_id:
 *           type: integer
 *         balance:
 *           type: integer
 *     LeaveRequest:
 *       type: object
 *       required:
 *         - leave_type_id
 *         - start_date
 *         - end_date
 *       properties:
 *         leave_type_id:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         reason:
 *           type: string
 *     UpdateLeaveStatus:
 *       type: object
 *       required:
 *         - leave_id
 *         - status
 *       properties:
 *         leave_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [approved, rejected, pending]
 */

/**
 * @swagger
 * /api/v1/leave/add-type:
 *   post:
 *     summary: Add a new leave type
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave type added successfully
 */
router.post("/add-type", validateLeaveType, leaveController.addLeaveType);

/**
 * @swagger
 * /api/v1/leave/assignbalance:
 *   post:
 *     summary: Assign leave balance to employee
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               leave_type_id:
 *                 type: integer
 *               balance:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Leave balance assigned successfully
 */
router.post("/assignbalance", validateAssignBalance, leaveController.assignLeaveBalance);

/**
 * @swagger
 * /api/v1/leave/apply-leave:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeaveRequest'
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
 */
router.post('/apply-leave', validateApplyLeave, leaveController.applyLeave);

/**
 * @swagger
 * /api/v1/leave/update-status:
 *   patch:
 *     summary: Update leave request status
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLeaveStatus'
 *     responses:
 *       200:
 *         description: Leave status updated successfully
 */
router.patch('/update-status', leaveController.updateLeaveStatus);

module.exports = router;