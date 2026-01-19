const express = require("express");
const router = express.Router();

const designationController = require("../Controller/designation.controller1");

const {
     ValidateCreateDesignation,
     ValidateReadDesignation,
     ValidateUpdateDesignation,
     ValidateDeleteDesignation,
} = require("../middlewares/designation_middleware")

// CREATE
router.post("/create",ValidateCreateDesignation, designationController.createDesignation);

// READ ALL
router.get("/all",ValidateReadDesignation, designationController.getAllDesignation);

// READ BY ID
router.get("/:id",ValidateReadDesignation ,designationController.getDesignationById);

// UPDATE
router.put("/:id",ValidateUpdateDesignation, designationController.updateDesignation);

// DELETE
router.delete("/:id",ValidateDeleteDesignation, designationController.deleteDesignation);

module.exports = router;
