const router = require("express").Router();
const controller = require("../controllers/roleController");

router.post("/createroles",controller.createRole);

router.get("/getroles",controller.getRoles);

router.get("/:value", controller.getRole);

module.exports = router;