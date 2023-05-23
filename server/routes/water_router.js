const router = require("express").Router();
const manipulationsController = require("../controllers/manipulations_controller.js");

const multer = require("multer");
const uploadPre = multer({ dest: "uploads/manipulated/" });

router.post(
  "/Manipulations",
  uploadPre.single("file"),
  manipulationsController.manipulations
);
module.exports = router;
