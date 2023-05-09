const csv = require("csvtojson");
const WaterModel = require("../models/Water_data_model");
const multer = require("multer");

exports.uploadCSVdata = async (req, res) => {
  try {
    const fileStorageEngine = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
      },
    });
    const upload = multer({
      storage: fileStorageEngine,
      fileFilter: (req, file, cb) => {
        //check if the file is csv
        if (file.mimetype !== "text/csv") {
          return cb(new Error("Only CSV files are allowed."));
        }
        cb(null, true);
      },
    });

    const file = req.file;
    if (!file) {
      return res.status(400).send("Please upload a CSV file.");
    }
    const JsonArray = await csv().fromFile(file.path);

    const dataRow = JsonArray.map((jsonObj) => ({
      Time: jsonObj.Time,
      CIT_01: jsonObj.CIT_01,
      TIT_01: jsonObj.TIT_01,
      PIT_03: jsonObj.PIT_03,
      PIT_04: jsonObj.PIT_04,
      Stage1_Pressure_Drop: jsonObj.Stage1_Pressure_Drop,
      PIT_05: jsonObj.PIT_05,
      PIT_06: jsonObj.PIT_06,
      Stage2_Pressure_Drop: jsonObj.Stage2_Pressure_Drop,
      FIT_03: jsonObj.FIT_03,
      CIT_02: jsonObj.CIT_02,
      PIT_07: jsonObj.PIT_07,
      FIT_02: jsonObj.FIT_02,
      FIT_01: jsonObj.FIT_01,
    }));

    const result = await WaterModel.insertMany(dataRow);
    res.status(201).json({ message: "Data successfully saved.", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
