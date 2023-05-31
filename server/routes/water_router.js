const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const WaterModel = require("../models/Water_data_model");
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

router.get("/getdata", async (req, res) => {
  try {
    const data = await WaterModel.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
  // MongoClient.connect(URI, (err, client) => {
  //   if (err) {
  //     return;
  //   }
  //   const collection = client.db("test").collection("current_datas");
  //   collection.find({}).toArray((err, data) => {
  //     if (err) {
  //       console.error("Error retrieving data from database:", err);
  //       res.status(500).json({ error: "Internal server error" });
  //     } else {
  //       console.log(data);
  //       res.json(data);
  //     }
  //     client.close();
  //   });
  // });
});

module.exports = router;
