const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const WaterModel = require("../models/Water_Import_model");
const DailyWaterModel = require("../models/Water_Daily_model");
const WeeklyWaterModel = require("../models/Water_Weekly_model");
const MonthlyWaterModel = require("../models/Water_Monthly_model");
const OutputBaselineWaterModel = require("../models/Water_OutputBaseline_model");
const baselineManipulationsController = require("../controllers/baseline_manipulations_controller.js");
const manipulationsController = require("../controllers/manipulations_controller.js");

require("dotenv").config();
const DB = process.env.DB;

const multer = require("multer");
const uploadPre = multer({ dest: "uploads/pre_manipulated/" });

const express = require("express");
const app = express();
router.get("/baseline", async (req, res) => {
  try {
    const data = await OutputBaselineWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get(
  "/baseline/input-data",
  baselineManipulationsController.getInputBaselineData
);
router.post(
  "/baseline/manipulations",
  baselineManipulationsController.baseline_manipulations
);

router.post(
  "/upload",
  uploadPre.single("file"),
  manipulationsController.manipulations
);

router.get("/getdailydata", async (req, res) => {
  try {
    const data = await DailyWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getweeklydata", async (req, res) => {
  try {
    const data = await WeeklyWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getmonthlydata", async (req, res) => {
  try {
    const data = await MonthlyWaterModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
