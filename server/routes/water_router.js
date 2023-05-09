const router = require("express").Router();
const water = require("../controllers/water_controller");

router.post("/upload", water.upload);

module.exports = router;
