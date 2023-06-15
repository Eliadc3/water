const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const WaterModel = require("../models/Water_Import_model");
const DailyWaterModel = require("../models/Water_Daily_model");
const WeeklyWaterModel = require("../models/Water_Weekly_model");
const MonthlyWaterModel = require("../models/Water_Monthly_model");
const manipulationsController = require("../controllers/manipulations_controller.js");

require("dotenv").config();
const URI = process.env.URI;

const multer = require("multer");
const uploadPre = multer({ dest: "uploads/pre_manipulated/" });

const express = require("express");
const app = express();

router.post(
  "/upload",
  uploadPre.single("file"),
  manipulationsController.manipulations
);

router.get("/getdailydata", async (req, res) => {
  try {
    const data = await DailyWaterModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getweeklydata", async (req, res) => {
  try {
    const data = await WeeklyWaterModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getmonthlydata", async (req, res) => {
  try {
    const data = await MonthlyWaterModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
