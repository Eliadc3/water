const router = require("express").Router();
const DailyWaterModel = require("../models/Water_Daily_model");
const WeeklyWaterModel = require("../models/Water_Weekly_model");
const MonthlyWaterModel = require("../models/Water_Monthly_model");
const OutputBaselineWaterModel = require("../models/Water_OutputBaseline_model");
const baselineManipulationsController = require("../controllers/baseline_manipulations_controller.js");
const manipulationsController = require("../controllers/manipulations_controller.js");

const multer = require("multer"); // Middleware for handling file uploads
const uploadPre = multer({ dest: "uploads/pre_manipulated/" }); // File upload configuration

const express = require("express");
const app = express();

// Route for retrieving baseline data
router.get("/baseline", async (req, res) => {
  try {
    const data = await OutputBaselineWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for baseline input data manipulation
router.get(
  "/baseline/input-data",
  baselineManipulationsController.getInputBaselineData
);

// Route for baseline manipulations
router.post(
  "/baseline/manipulations",
  baselineManipulationsController.baseline_manipulations
);

// Route for uploading files for manipulation
router.post(
  "/upload",
  uploadPre.single("file"),
  manipulationsController.manipulations
);

// Route for retrieving daily water data
router.get("/getdailydata", async (req, res) => {
  try {
    const data = await DailyWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for retrieving weekly water data
router.get("/getweeklydata", async (req, res) => {
  try {
    const data = await WeeklyWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for retrieving monthly water data
router.get("/getmonthlydata", async (req, res) => {
  try {
    const data = await MonthlyWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export the router to be used in the main application
module.exports = router;
