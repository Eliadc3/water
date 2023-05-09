const router = require("express").Router();
const uploadController = require("../controllers/upload_controller.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/uploadCSVdata",
  upload.single("file"),
  uploadController.uploadCSVdata
);
module.exports = router;
