const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const WaterModel = require("../models/Water_data_model");
const DailyWaterModel = require("../models/Daily_Water_data_model");
require("dotenv").config();
const URI = process.env.URI;

const manipulationsController = require("../controllers/manipulations_controller.js");

const multer = require("multer");
const uploadPre = multer({ dest: "uploads/manipulated/" });

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
    const data = await DailyWaterModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
