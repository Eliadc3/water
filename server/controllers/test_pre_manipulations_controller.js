const csv = require("csvtojson");
const WaterModel = require("../models/Water_data_model");
const multer = require("multer");

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
    }));

    // let Stage1_concentrate_flow_m3h,
    //   Stage2_concentrate_factor,
    //   Stage1_feed_TDS_mgl,
    //   TCF,
    //   Permeate_TDS_mgl,
    //   Stage1_pressure_drop_bar,
    //   Stage1_average_flow_m3h,
    //   Stage2_pressure_drop_bar,
    //   Stage2_average_flow_m3h,
    //   Stage1_concentrate_factor,
    //   Salt_rejection,
    //   Stage1_normalized_pressure_drop_bar,
    //   Stage2_normalized_pressure_drop_bar,
    //   Stage1_concentrate_TDS_mgl,
    //   Stage2_concentrate_TDS_mgl,
    //   Salt_passage,
    //   Stage1_aNDP,
    //   Stage2_aNDP,
    //   Normalized_salt_rejection,
    //   Stage1_baseline_net_permeate_flow,
    //   Stage2_baseline_net_permeate_flow;

    // first iteration loop
    const firstIterationLoop = manipulatedData.map((curr, index) => {
      const Stage1_concentrate_flow_m3h =
        parseFloat(curr.FIT_02 === "NaN" ? 0 : curr.FIT_02) +
        parseFloat(curr.FIT_03 === "NaN" ? 0 : curr.FIT_03);

      const Stage2_concentrate_factor =
        (parseFloat(curr.FIT_02 === "NaN" ? 0 : curr.FIT_02) +
          parseFloat(curr.FIT_03 === "NaN" ? 0 : curr.FIT_03)) /
        parseFloat(curr.FIT_03 === "NaN" ? 0 : curr.FIT_03);

      const Stage1_feed_TDS_mgl =
        parseFloat(curr.CIT_01 === "NaN" ? 0 : curr.CIT_01) * 0.67;

      const TCF = Math.exp(2640 * (1 / 298 - 1 / (273 + curr.TIT_01)));

      const Permeate_TDS_mgl = curr.CIT_01 * 0.67;

      const Stage1_pressure_drop_bar = curr.PIT_03 - curr.PIT_04;

      const Stage1_average_flow_m3h =
        (curr.FIT_01 + curr.FIT_02 + curr.FIT_03) / 2;

      const Stage2_pressure_drop_bar = curr.PIT_05 - curr.PIT_06;

      const Stage2_average_flow_m3h = (curr.FIT_02 + curr.FIT_03) / 2;
      return {
        Stage1_concentrate_flow_m3h,
        Stage2_concentrate_factor,
        Stage1_feed_TDS_mgl,
        TCF,
        Permeate_TDS_mgl,
        Stage1_pressure_drop_bar,
        Stage1_average_flow_m3h,
        Stage2_pressure_drop_bar,
        Stage2_average_flow_m3h,
        index,
        ...curr,
      };
    });

    // second iteration loop
    const secondIterationLoop = firstIterationLoop.map((curr, index) => {
      const Stage1_concentrate_factor =
        (parseFloat(curr.FIT_01 === "NaN" ? 0 : curr.FIT_01) +
          curr.Stage1_concentrate_flow_m3h) /
        curr.Stage1_concentrate_flow_m3h;

      const Salt_rejection =
        1 - curr.Permeate_TDS_mgl / curr.Stage1_feed_TDS_mgl;

      const Stage1_normalized_pressure_drop_bar =
        (curr.Stage1_average_flow_m3h / curr.Stage1_average_flow_m3h) *
        curr.Stage1_pressure_drop_bar;
      const Stage2_normalized_pressure_drop_bar =
        (curr.Stage2_average_flow_m3h / curr.Stage2_average_flow_m3h) *
        curr.Stage2_pressure_drop_bar;
      return {
        Stage1_concentrate_factor,
        Salt_rejection,
        Stage1_normalized_pressure_drop_bar,
        Stage2_normalized_pressure_drop_bar,
        index,
        ...curr,
      };
    });

    // third iteration loop
    const thirdItertationLoop = secondIterationLoop.map((curr, index) => {
      const Stage1_concentrate_TDS_mgl =
        curr.Stage1_feed_TDS_mgl * curr.Stage1_concentrate_factor;

      const Stage2_concentrate_TDS_mgl =
        curr.Stage1_concentrate_TDS_mgl * curr.Stage2_concentrate_factor;

      const Salt_passage = 1 - curr.Salt_rejection;
      return {
        Stage1_concentrate_TDS_mgl,
        Stage2_concentrate_TDS_mgl,
        Salt_passage,
        index,
        ...curr,
      };
    });

    // third iteration loop
    const fourthIterationLoop = thirdItertationLoop.map((curr, index) => {
      const Stage1_aNDP =
        (curr.PIT_03 + curr.PIT_04) * (14.5 / 2) -
        (curr.Stage1_feed_TDS_mgl + curr.Stage1_concentrate_TDS_mgl) / 200 -
        curr.PIT_07 * 14.5;

      const Stage2_aNDP =
        (curr.PIT_05 + curr.PIT_06) * (14.5 / 2) -
        (curr.Stage1_concentrate_TDS_mgl + curr.Stage2_concentrate_TDS_mgl) /
          200 -
        curr.PIT_07 * 14.5;

      const Normalized_salt_rejection =
        100 -
        curr.Salt_passage *
          (((curr.FIT_01 + curr.FIT_02) / (curr.FIT_01 + curr.FIT_02)) *
            curr.TCF) *
          100;
      return {
        Stage1_aNDP,
        Stage2_aNDP,
        Normalized_salt_rejection,
        index,
        ...curr,
      };
    });

    // fifth iteration loop
    const fifthIterationLoop = fourthIterationLoop.map((curr, index) => {
      const Stage1_baseline_net_permeate_flow =
        curr.FIT_01 *
        (curr.Stage1_aNDP / curr.Stage1_aNDP) *
        (curr.TCF / curr.TCF);

      const Stage2_baseline_net_permeate_flow =
        curr.FIT_02 *
        (curr.Stage2_aNDP / curr.Stage2_aNDP) *
        (curr.TCF / curr.TCF);

      return {
        Stage1_baseline_net_permeate_flow,
        Stage2_baseline_net_permeate_flow,
        index,
        ...curr,
      };
    });

    let result = {
      firstIterationLoop,
      secondIterationLoop,
      thirdItertationLoop,
      fourthIterationLoop,
      fifthIterationLoop,
    };

    // Save all the data from the csv file in object by the schema
    const results = await WaterModel.insertMany(fifthIterationLoop);

    return res
      .status(201)
      .json({ message: "Data successfully saved.", results });
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
