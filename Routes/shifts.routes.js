const express= require("express");
const router=express.Router();
const shiftController=require("../Controller/shift.controller");


router.post("/add",shiftController.createShift);

router.get("/getall",shiftController.getAllShifts);


module.exports = router;