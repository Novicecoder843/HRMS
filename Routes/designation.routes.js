const express = require("express");
const router = express.Router();

const designationController = require("../Controller/designation.controller1");

// CREATE
router.post("/create", designationController.createDesignation);

// READ ALL
router.get("/all", designationController.getAllDesignation);

// READ BY ID
router.get("/:id", designationController.getDesignationById);

// UPDATE
router.put("/:id", designationController.updateDesignation);

// DELETE
router.delete("/:id", designationController.deleteDesignation);

module.exports = router;
