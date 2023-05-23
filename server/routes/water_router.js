const router = require("express").Router();
const uploadController = require("../controllers/upload_controller.js");
const manipulationsController = require("../controllers/manipulations_controller.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const uploadPre = multer({ dest: "uploads/premanipulated/" });

// router.post(
//   "/uploadCSVdata",
//   upload.single("file"),
//   uploadController.uploadCSVdata
// );
router.post(
  "/preManipulations",
  uploadPre.single("file"),
  manipulationsController.preManipulations
);
module.exports = router;
