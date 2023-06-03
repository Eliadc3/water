const router = require("express").Router();
require("dotenv").config();

const WaterModel = require("../models/Water_data_model");
const DailyAveragesModel = require("../models/Daily_Water_data_model");
const WeeklyAveragesModel = require("../models/Weekly_Water_data_model");
const MonthlyAveragesModel = require("../models/Monthly_Water_data_model");

const manipulationsController = require("../controllers/manipulations_controller.js");
const dailyAveragesController = require("../controllers/dailyAverages_controller.js");
const weeklyAveragesController = require("../controllers/weeklyAverages_controller.js");
const monthlyAveragesController = require("../controllers/monthlyAverages_controller.js");

const multer = require("multer");
const uploadPre = multer({ dest: "uploads/manipulated/" });

// Routes
router.post(
  "/manipulations",
  uploadPre.single("file"),
  manipulationsController.manipulations
);

const express = require("express");
const app = express();

router.get("/getalldata", async (req, res) => {
  try {
    const data = await WaterModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getdailydata", async (req, res) => {
  try {
    const data = await DailyAveragesModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving daily data from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getweeklydata", async (req, res) => {
  try {
    await weeklyAveragesController.calculateWeeklyAverages();
    const data = await WeeklyAveragesModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving weekly data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getmonthlydata", async (req, res) => {
  try {
    await monthlyAveragesController.calculateMonthlyAverages();
    const data = await MonthlyAveragesModel.find({});
    res.json(data);
  } catch (err) {
    console.error("Error retrieving monthly data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
