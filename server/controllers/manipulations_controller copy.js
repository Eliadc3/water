const csv = require("csvtojson");
const WaterModel = require("../models/Water_data_model");
const multer = require("multer");

exports.manipulations = async (req, res) => {
  try {
    // Upload:
    // --- destination (where the file will save)
    const fileStorageEngine = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads/manipulated");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-manipulated-" + file.originalname);
      },
    });

    // --- create a property that saves the uploaded file and check if the file's format is csv
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
    // Create an objects array from the csv file data
    const JsonArray = await csv().fromFile(file.path);

    // Create data object from csv file data
    const manipulatedData = JsonArray.map((jsonObj) => ({
      Time: jsonObj.Time,
      CIT_01: parseFloat(jsonObj.CIT_01).toFixed(2),
      TIT_01: parseFloat(jsonObj.TIT_01).toFixed(2),
      PIT_03: parseFloat(jsonObj.PIT_03).toFixed(2),
      PIT_04: parseFloat(jsonObj.PIT_04).toFixed(2),
      Stage1_Pressure_Drop: parseFloat(jsonObj.Stage1_Pressure_Drop).toFixed(2),
      PIT_05: parseFloat(jsonObj.PIT_05).toFixed(2),
      PIT_06: parseFloat(jsonObj.PIT_06).toFixed(2),
      Stage2_Pressure_Drop: parseFloat(jsonObj.Stage2_Pressure_Drop).toFixed(2),
      FIT_03: parseFloat(jsonObj.FIT_03).toFixed(2),
      CIT_02: parseFloat(jsonObj.CIT_02).toFixed(2),
      PIT_07: parseFloat(jsonObj.PIT_07).toFixed(2),
      FIT_02: parseFloat(jsonObj.FIT_02).toFixed(2),
      FIT_01: parseFloat(jsonObj.FIT_01).toFixed(2),
      // start the manipulation
    }));

    // Save all the data from the csv file in object by the schema
    const result = await WaterModel.insertMany(manipulatedData);
    res.status(201).json({ message: "Data successfully saved.", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
