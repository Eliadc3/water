const router = require("express").Router();
const uploadController = require("../controllers/upload_controller.js");
const preManipulationsController = require("../controllers/test_pre_manipulations_controller.js");

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
  preManipulationsController.preManipulations
);
module.exports = router;
