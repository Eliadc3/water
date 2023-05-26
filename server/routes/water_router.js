const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
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

router.get("/manipulations", (req, res) => {
  MongoClient.connect(URI, (err, client) => {
    if (err) {
      console.error("Error connecting to MongoDB:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const collection = client.db("test").collection("current_datas");
    collection.find({}).toArray((err, data) => {
      if (err) {
        console.error("Error retrieving data from database:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        console.log(data);
        res.json(data);
      }
      client.close();
    });
  });
});

module.exports = router;
