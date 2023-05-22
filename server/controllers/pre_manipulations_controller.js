const csv = require("csvtojson");
const WaterModel = require("../models/Water_data_model");
const multer = require("multer");
// const { default: mongoose } = require("mongoose");

// const ManipulatedSchema = new mongoose.Schema({
//   Stage1_concentrate_flow_m3h: Number,
//   Stage1_concentrate_factor: Number,
//   Stage2_concentrate_factor: Number,
//   Stage1_feed_TDS_mgl: Number,
// });
// const manipulatedData = mongoose.model("ManipData", ManipulatedSchema);

exports.preManipulations = async (req, res) => {
  try {
    // Upload:
    // --- destination (where the file will save)
    const fileStorageEngine = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads/premanipulated");
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

    const DataManipulation = JsonArray.map((jsonObj) => {
      const Stage1_concentrate_flow_m3h = parseFloat(
        jsonObj.Stage1_concentrate_flow_m3h
      );
      const Stage1_concentrate_factor = parseFloat(
        jsonObj.Stage1_concentrate_factor
      );
      const Stage2_concentrate_factor = parseFloat(
        jsonObj.Stage2_concentrate_factor
      );
      const Stage1_feed_TDS_mgl = parseFloat(jsonObj.Stage1_feed_TDS_mgl);

      // start the manipulation
    });
    //console.log(manipulatedData.map((jsonObj) => parseFloat(jsonObj.FIT_01)));
    const Stage1_concentrate_flow_m3h = manipulatedData.reduce((acc, curr) => {
      return acc + FIT_01 + curr.FIT_02 + curr.FIT_03 - curr.FIT_01;
    }, 0);
    console.log(Stage1_concentrate_flow_m3h);

    const Stage1_concentrate_factor =
      manipulatedData.reduce((acc, curr) => {
        return (
          acc +
          parseFloat(curr.FIT_01) +
          parseFloat(curr.FIT_02) +
          parseFloat(curr.FIT_03)
        );
      }, 0) / Stage1_concentrate_flow_m3h;

    const Stage2_concentrate_factor = manipulatedData.reduce((acc, curr) => {
      return (
        acc +
        parseFloat(curr.FIT_02) +
        parseFloat(curr.FIT_03) / parseFloat(curr.FIT_03)
      );
    }, 0);

    const Stage1_feed_TDS_mgl = manipulatedData.map(
      (jsonObj) => parseFloat(jsonObj.CIT_01) * 0.67
    );

    const Stage1_concentrate_TDS_mgl = manipulatedData.map((jsonObj) => {
      const index = manipulatedData.indexOf(jsonObj);
      const denominator =
        parseFloat(Stage1_concentrate_flow_m3h) * parseFloat(jsonObj.FIT_04);
      if (denominator === 0) {
        return 0;
      }
      return (
        (parseFloat(jsonObj.FIT_01) *
          (parseFloat(jsonObj.FIT_02) + parseFloat(jsonObj.FIT_03))) /
        denominator
      );
    });

    const Stage2_concentrate_TDS_mgl = manipulatedData.map((jsonObj) => {
      const concentrateFactor =
        parseFloat(jsonObj.FIT_02) + parseFloat(jsonObj.FIT_03);
      const index = manipulatedData.indexOf(jsonObj);
      return parseFloat(Stage1_concentrate_TDS_mgl[index]) * concentrateFactor;
    });

    const Stage2_Concentrate_Flow_m3h = manipulatedData.reduce((acc, curr) => {
      return (
        acc +
        parseFloat(curr.FIT_02) +
        parseFloat(curr.FIT_03) -
        parseFloat(curr.FIT_02)
      );
    }, 0);

    const Stage2_concentrate_flow_m3h =
      Stage1_concentrate_flow_m3h + Stage2_Concentrate_Flow_m3h;

    manipulatedData.forEach((obj) => {
      obj.Stage1_Concentrate_Flow_m3h = Stage1_concentrate_flow_m3h;
      obj.Stage1_Concentrate_Factor =
        parseFloat(obj.FIT_01) / Stage1_concentrate_flow_m3h;
      obj.Stage2_Concentrate_Factor =
        (parseFloat(obj.FIT_02) + parseFloat(obj.FIT_03)) /
        Stage2_concentrate_flow_m3h;
    });

    const calculates = manipulatedData.map((jsonObj, index) => ({
      Stage1_concentrate_flow_m3h,
      Stage1_concentrate_factor,
      Stage2_concentrate_factor,
      Stage1_feed_TDS_mgl: parseFloat(Stage1_feed_TDS_mgl[index]).toFixed(2),
      Stage1_concentrate_TDS_mgl: parseFloat(
        Stage1_concentrate_TDS_mgl[index]
      ).toFixed(2),
      Stage2_concentrate_TDS_mgl: parseFloat(
        Stage2_concentrate_TDS_mgl[index]
      ).toFixed(2),
    }));

    const myObject = {
      data: manipulatedData,
    };

    //console.log(myObject);
    // const Stage1_concentrate_flow_m3h =
    //   manipulatedData.FIT_01 +
    //   manipulatedData.FIT_02 +
    //   manipulatedData.FIT_03 -
    //   manipulatedData.FIT_01;

    // const rnd_Stage1_concentrate_flow_m3h = parseFloat(
    //   Stage1_concentrate_flow_m3h.toFixed(2)
    // );
    // //----//
    // const Stage1_concentrate_factor =
    //   manipulatedData.FIT_01 +
    //   Stage1_concentrate_flow_m3h / Stage1_concentrate_flow_m3h;

    // const rnd_Stage1_concentrate_factor = parseFloat(
    //   Stage1_concentrate_factor.toFixed(2)
    // );
    // //----//
    // const Stage2_concentrate_factor =
    //   manipulatedData.FIT_02 + manipulatedData.FIT_03 / manipulatedData.FIT_03;

    // const Stage1_feed_TDS_mgl = parseFloat(manipulatedData.CIT_01 * 0.67);
    // parseFloat(Stage1_feed_TDS_mgl);

    // const Stage1_concentrate_TDS_mgl =
    //   parseFloat(Stage1_feed_TDS_mgl).toFixed(2) *
    //   parseFloat(Stage1_concentrate_factor).toFixed(2);

    // const Stage2_concentrate_TDS_mgl =
    //   Stage1_concentrate_TDS_mgl * Stage2_concentrate_factor;
    // parseFloat(Stage2_concentrate_TDS_mgl).toFixed(2);

    // const calculates = {
    //   ...manipulatedData,
    //   Stage1_concentrate_flow_m3h: rnd_Stage1_concentrate_flow_m3h,
    //   Stage1_concentrate_factor: rnd_Stage1_concentrate_factor,
    //   Stage2_concentrate_factor,
    //   Stage1_feed_TDS_mgl,
    //   Stage1_concentrate_TDS_mgl,
    //   Stage2_concentrate_TDS_mgl,
    // };

    // Save all the data from the csv file in object by the schema
    const result = await WaterModel.insertMany(calculates);
    //console.log(calculates);
    return res
      .status(201)
      .json({ message: "Data successfully saved.", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// // Create data object from csv file data
// for (let i = 0; i < 1; i++) {
//   const manipulatedData = {
//     Time: JsonArray[i].Time,
//     CIT_01: Number(JsonArray[i].CIT_01),
//     TIT_01: Number(JsonArray[i].TIT_01),
//     PIT_03: Number(JsonArray[i].PIT_03),
//     PIT_04: Number(JsonArray[i].PIT_04),
//     Stage1_Pressure_Drop: Number(JsonArray[i].Stage1_Pressure_Drop),
//     PIT_05: Number(JsonArray[i].PIT_05),
//     PIT_06: Number(JsonArray[i].PIT_06),
//     Stage2_Pressure_Drop: Number(JsonArray[i].Stage2_Pressure_Drop),
//     FIT_03: Number(JsonArray[i].FIT_03),
//     CIT_02: Number(JsonArray[i].CIT_02),
//     PIT_07: Number(JsonArray[i].PIT_07),
//     FIT_02: Number(JsonArray[i].FIT_02),
//     FIT_01: Number(JsonArray[i].FIT_01),
//   };

//   // Manipulations
//   const Stage1_concentrate_flow_m3h =
//     manipulatedData.FIT_01 +
//     manipulatedData.FIT_02 +
//     manipulatedData.FIT_03 -
//     manipulatedData.FIT_01;

//   const Stage1_concentrate_factor =
//     manipulatedData.FIT_01 +
//     Stage1_concentrate_flow_m3h / Stage1_concentrate_flow_m3h;

//   const Stage2_concentrate_factor =
//     manipulatedData.FIT_02 +
//     manipulatedData.FIT_03 / manipulatedData.FIT_03;

//   const Stage1_feed_TDS_mgl = parseFloat(manipulatedData.CIT_01 * 0.67);
//   parseFloat(Stage1_feed_TDS_mgl);

//   const Stage1_concentrate_TDS_mgl =
//     parseFloat(Stage1_feed_TDS_mgl).toFixed(2) *
//     parseFloat(Stage1_concentrate_factor).toFixed(2);

//   const Stage2_concentrate_TDS_mgl =
//     Stage1_concentrate_TDS_mgl * Stage2_concentrate_factor;
//   parseFloat(Stage2_concentrate_TDS_mgl).toFixed(2);

//   const calculates = {
//     Stage1_concentrate_flow_m3h,
//     Stage1_concentrate_factor,
//     Stage2_concentrate_factor,
//     Stage1_feed_TDS_mgl,
//     Stage1_concentrate_TDS_mgl,
//     Stage2_concentrate_TDS_mgl,
//   };
//   console.log(parseFloat(calculates.Stage1_feed_TDS_mgl).toFixed(2));
//   console.log(typeof calculates.Stage1_feed_TDS_mgl);
// }
