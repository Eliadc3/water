const csv = require("csvtojson");
const WaterModel = require("../models/Water_data_model");
const DailyWaterModel = require("../models/Daily_Water_data_model");
const WeeklyWaterModel = require("../models/Weekly_Water_data_model");
const MonthlyWaterModel = require("../models/Monthly_Water_data_model");

const moment = require("moment");
const multer = require("multer");

exports.manipulations = async (req, res) => {
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

    // Check if there is already exists record in the db.
    const existsRecords = await WaterModel.find({}).lean();
    const existingTimes = existsRecords.map((record) => record.Time);
    const newRecords = JsonArray.filter((jsonObj) => {
      return !existingTimes.includes(jsonObj.Time);
    });

    // filter the data to see if this is number or the record was accurate
    const manipulatedData = newRecords
      .filter((jsonObj) => {
        return parseFloat(jsonObj.System_On_Off_bit) === 1;
      })
      // parse all the data to number for the manipulations
      .map((jsonObj) => ({
        Time: jsonObj.Time,
        System_On_Off_bit: parseFloat(jsonObj.System_On_Off_bit),
        CIT_01: parseFloat(jsonObj.CIT_01),
        TIT_01: parseFloat(jsonObj.TIT_01),
        PIT_03: parseFloat(jsonObj.PIT_03),
        PIT_04: parseFloat(jsonObj.PIT_04),
        Stage1_Pressure_Drop: parseFloat(jsonObj.Stage1_Pressure_Drop),
        PIT_05: parseFloat(jsonObj.PIT_05),
        PIT_06: parseFloat(jsonObj.PIT_06),
        Stage2_Pressure_Drop: parseFloat(jsonObj.Stage2_Pressure_Drop),
        FIT_03: parseFloat(jsonObj.FIT_03),
        CIT_02: parseFloat(jsonObj.CIT_02),
        PIT_07: parseFloat(jsonObj.PIT_07),
        FIT_02: parseFloat(jsonObj.FIT_02),
        FIT_01: parseFloat(jsonObj.FIT_01),
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
        parseFloat(
          curr.FIT_02 === "NaN" || curr.FIT_02 === 0 ? 0 : curr.FIT_02
        ) +
        parseFloat(
          curr.FIT_03 === "NaN" || curr.FIT_03 === 0 ? 0 : curr.FIT_03
        );
      const fixed_Stage1_concentrate_flow_m3h = parseFloat(
        Stage1_concentrate_flow_m3h.toFixed(2)
      );

      const Stage2_concentrate_factor =
        (parseFloat(
          curr.FIT_02 === "NaN" || curr.FIT_02 === 0 ? 0 : curr.FIT_02
        ) +
          parseFloat(
            curr.FIT_03 === "NaN" || curr.FIT_03 === 0 ? 0 : curr.FIT_03
          )) /
        parseFloat(
          curr.FIT_03 === "NaN" || curr.FIT_03 === 0 ? 0 : curr.FIT_03
        );
      const fixed_Stage2_concentrate_factor = parseFloat(
        Stage2_concentrate_factor.toFixed(2)
      );

      const Stage1_feed_TDS_mgl =
        parseFloat(
          curr.CIT_01 === "NaN" || curr.CIT_01 === 0 ? 0 : curr.CIT_01
        ) * 0.67;
      const fixed_Stage1_feed_TDS_mgl = parseFloat(
        Stage1_feed_TDS_mgl.toFixed(2)
      );

      const TCF = Math.exp(2640 * (1 / 298 - 1 / (273 + curr.TIT_01)));
      const fixed_TCF = parseFloat(TCF.toFixed(2));

      const Permeate_TDS_mgl = curr.CIT_01 * 0.67;
      const fixed_Permeate_TDS_mgl = parseFloat(Permeate_TDS_mgl.toFixed(2));

      const Stage1_pressure_drop_bar = curr.PIT_03 - curr.PIT_04;
      const fixed_Stage1_pressure_drop_bar = parseFloat(
        Stage1_pressure_drop_bar.toFixed(2)
      );

      const Stage1_average_flow_m3h =
        (curr.FIT_01 + curr.FIT_02 + curr.FIT_03) / 2;
      const fixed_Stage1_average_flow_m3h = parseFloat(
        Stage1_average_flow_m3h.toFixed(2)
      );

      const Stage2_pressure_drop_bar = curr.PIT_05 - curr.PIT_06;
      const fixed_Stage2_pressure_drop_bar = parseFloat(
        Stage2_pressure_drop_bar.toFixed(2)
      );

      const Stage2_average_flow_m3h = (curr.FIT_02 + curr.FIT_03) / 2;
      const fixed_Stage2_average_flow_m3h = parseFloat(
        Stage2_average_flow_m3h.toFixed(2)
      );

      return {
        Stage1_concentrate_flow_m3h: fixed_Stage1_concentrate_flow_m3h,
        Stage2_concentrate_factor: fixed_Stage2_concentrate_factor,
        Stage1_feed_TDS_mgl: fixed_Stage1_feed_TDS_mgl,
        TCF: fixed_TCF,
        Permeate_TDS_mgl: fixed_Permeate_TDS_mgl,
        Stage1_pressure_drop_bar: fixed_Stage1_pressure_drop_bar,
        Stage1_average_flow_m3h: fixed_Stage1_average_flow_m3h,
        Stage2_pressure_drop_bar: fixed_Stage2_pressure_drop_bar,
        Stage2_average_flow_m3h: fixed_Stage2_average_flow_m3h,
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
      const fixed_Stage1_concentrate_factor = parseFloat(
        Stage1_concentrate_factor.toFixed(2)
      );

      const Salt_rejection =
        1 - curr.Permeate_TDS_mgl / curr.Stage1_feed_TDS_mgl;
      const fixed_Salt_rejection = parseFloat(Salt_rejection.toFixed(2));

      const Stage1_normalized_pressure_drop_bar =
        (curr.Stage1_average_flow_m3h / curr.Stage1_average_flow_m3h) *
        curr.Stage1_pressure_drop_bar;
      const fixed_Stage1_normalized_pressure_drop_bar = parseFloat(
        Stage1_normalized_pressure_drop_bar.toFixed(2)
      );

      const Stage2_normalized_pressure_drop_bar =
        (curr.Stage2_average_flow_m3h / curr.Stage2_average_flow_m3h) *
        curr.Stage2_pressure_drop_bar;
      const fixed_Stage2_normalized_pressure_drop_bar = parseFloat(
        Stage2_normalized_pressure_drop_bar.toFixed(2)
      );

      return {
        Stage1_concentrate_factor: fixed_Stage1_concentrate_factor,
        Salt_rejection: fixed_Salt_rejection,
        Stage1_normalized_pressure_drop_bar:
          fixed_Stage1_normalized_pressure_drop_bar,
        Stage2_normalized_pressure_drop_bar:
          fixed_Stage2_normalized_pressure_drop_bar,
        index,
        ...curr,
      };
    });

    // third iteration loop
    const thirdItertationLoop = secondIterationLoop.map((curr, index) => {
      const Stage1_concentrate_TDS_mgl =
        curr.Stage1_feed_TDS_mgl * curr.Stage1_concentrate_factor;
      const fixed_Stage1_concentrate_TDS_mgl = parseFloat(
        Stage1_concentrate_TDS_mgl.toFixed(2)
      );

      const Salt_passage = 1 - curr.Salt_rejection;
      const fixed_Salt_passage = parseFloat(Salt_passage.toFixed(2));

      return {
        Stage1_concentrate_TDS_mgl: fixed_Stage1_concentrate_TDS_mgl,
        Salt_passage: fixed_Salt_passage,
        index,
        ...curr,
      };
    });

    // third iteration loop
    const fourthIterationLoop = thirdItertationLoop.map((curr, index) => {
      const Stage2_concentrate_TDS_mgl =
        curr.Stage1_concentrate_TDS_mgl * curr.Stage2_concentrate_factor;
      const fixed_Stage2_concentrate_TDS_mgl = parseFloat(
        Stage2_concentrate_TDS_mgl.toFixed(2)
      );

      const Stage1_aNDP =
        (curr.PIT_03 + curr.PIT_04) * (14.5 / 2) -
        (curr.Stage1_feed_TDS_mgl + curr.Stage1_concentrate_TDS_mgl) / 200 -
        curr.PIT_07 * 14.5;
      const fixed_Stage1_aNDP = parseFloat(Stage1_aNDP.toFixed(2));

      const Normalized_salt_rejection =
        100 -
        curr.Salt_passage *
          ((curr.FIT_01 + curr.FIT_02 + (curr.FIT_01 + curr.FIT_02)) *
            curr.TCF) *
          100;
      const fixed_Normalized_salt_rejection = parseFloat(
        Normalized_salt_rejection.toFixed(2)
      );

      return {
        Stage2_concentrate_TDS_mgl: fixed_Stage2_concentrate_TDS_mgl,
        Stage1_aNDP: fixed_Stage1_aNDP,
        Normalized_salt_rejection: fixed_Normalized_salt_rejection,
        index,
        ...curr,
      };
    });

    // fifth iteration loop
    const fifthIterationLoop = fourthIterationLoop.map((curr, index) => {
      const Stage2_aNDP =
        (curr.PIT_05 + curr.PIT_06) * (14.5 / 2) -
        (curr.Stage1_concentrate_TDS_mgl + curr.Stage2_concentrate_TDS_mgl) /
          200 -
        curr.PIT_07 * 14.5;
      const fixed_Stage2_aNDP = parseFloat(Stage2_aNDP.toFixed(2));

      const Stage1_baseline_net_permeate_flow =
        curr.FIT_01 *
        (curr.Stage1_aNDP / curr.Stage1_aNDP) *
        (curr.TCF / curr.TCF);
      const fixed_Stage1_baseline_net_permeate_flow = parseFloat(
        Stage1_baseline_net_permeate_flow.toFixed(2)
      );

      return {
        Stage2_aNDP: fixed_Stage2_aNDP,
        Stage1_baseline_net_permeate_flow:
          fixed_Stage1_baseline_net_permeate_flow,
        index,
        ...curr,
      };
    });

    // sixth iteration loop
    const sixthIterationLoop = fifthIterationLoop.map((curr, index) => {
      const Stage2_baseline_net_permeate_flow =
        curr.FIT_02 *
        (curr.Stage2_aNDP / curr.Stage2_aNDP) *
        (curr.TCF / curr.TCF);
      const fixed_Stage2_baseline_net_permeate_flow = parseFloat(
        Stage2_baseline_net_permeate_flow.toFixed(2)
      );

      return {
        Stage2_baseline_net_permeate_flow:
          fixed_Stage2_baseline_net_permeate_flow,
        index,
        ...curr,
      };
    });

    // calculate daily average
    const dailyAverages = {};
    sixthIterationLoop.forEach((record) => {
      // convert the time field to date object
      const date = moment(record.Time, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY");
      if (!dailyAverages[date]) {
        dailyAverages[date] = {
          count: 0,
          total: { ...record },
        };
      } else {
        const dailyTotal = dailyAverages[date].total;
        for (const field in dailyTotal) {
          if (field !== "index" && field !== "Time") {
            dailyTotal[field] += record[field];
          }
        }
      }
      dailyAverages[date].count++;
    });

    for (const date in dailyAverages) {
      const count = dailyAverages[date].count;
      const dailyTotal = dailyAverages[date].total;
      for (const field in dailyTotal) {
        if (field !== "index" && field !== "Time") {
          dailyTotal[field] /= count;
          dailyTotal[field] = parseFloat(dailyTotal[field].toFixed(2));
        }
      }
    }

    const dailyAveragesData = Object.keys(dailyAverages).map((date) => ({
      date,
      average: dailyAverages[date].total,
    }));

    const dailyResults = await DailyWaterModel.insertMany(dailyAveragesData);

    // calculate weekly average
    const weeklyAverages = {};
    sixthIterationLoop.forEach((record) => {
      // convert the time field to date object
      const date = moment(record.Time, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY");
      const weekStartDate = moment(date, "DD-MM-YYYY")
        .startOf("isoWeek")
        .format("DD-MM-YYYY");

      if (!weeklyAverages[weekStartDate]) {
        weeklyAverages[weekStartDate] = {
          count: 0,
          total: { ...record },
        };
      } else {
        const weeklyTotal = weeklyAverages[weekStartDate].total;
        for (const field in weeklyTotal) {
          if (field !== "index" && field !== "Time") {
            weeklyTotal[field] += record[field];
          }
        }
      }
      weeklyAverages[weekStartDate].count++;
    });

    for (const weekStartDate in weeklyAverages) {
      const count = weeklyAverages[weekStartDate].count;
      const weeklyTotal = weeklyAverages[weekStartDate].total;
      for (const field in weeklyTotal) {
        if (field !== "index" && field !== "Time") {
          weeklyTotal[field] /= count;
          weeklyTotal[field] = parseFloat(weeklyTotal[field].toFixed(2));
        }
      }
    }

    const weeklyAveragesData = Object.keys(weeklyAverages).map(
      (weekStartDate) => ({
        date: weekStartDate,
        average: weeklyAverages[weekStartDate].total,
      })
    );

    const weeklyResults = await WeeklyWaterModel.insertMany(weeklyAveragesData);

    // calculate monthly average
    const monthlyAverages = {};
    sixthIterationLoop.forEach((record) => {
      // convert the time field to date object
      const date = moment(record.Time, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY");
      const monthStartDate = moment(date, "DD-MM-YYYY")
        .startOf("month")
        .format("DD-MM-YYYY");

      if (!monthlyAverages[monthStartDate]) {
        monthlyAverages[monthStartDate] = {
          count: 0,
          total: { ...record },
        };
      } else {
        const monthlyTotal = monthlyAverages[monthStartDate].total;
        for (const field in monthlyTotal) {
          if (field !== "index" && field !== "Time") {
            monthlyTotal[field] += record[field];
          }
        }
      }
      monthlyAverages[monthStartDate].count++;
    });

    for (const monthStartDate in monthlyAverages) {
      const count = monthlyAverages[monthStartDate].count;
      const monthlyTotal = monthlyAverages[monthStartDate].total;
      for (const field in monthlyTotal) {
        if (field !== "index" && field !== "Time") {
          monthlyTotal[field] /= count;
          monthlyTotal[field] = parseFloat(monthlyTotal[field].toFixed(2));
        }
      }
    }

    const monthlyAveragesData = Object.keys(monthlyAverages).map(
      (monthStartDate) => ({
        date: monthStartDate,
        average: monthlyAverages[monthStartDate].total,
      })
    );

    const monthlyResults = await MonthlyWaterModel.insertMany(
      monthlyAveragesData
    );

    // Save all the data from the csv file in object by the schema
    const results = await WaterModel.insertMany(sixthIterationLoop);
    return res.status(201).json({
      message: "Data successfully saved.",
      results,
      dailyAverages: dailyResults,
      weeklyAverages: weeklyResults,
      monthlyAverages: monthlyResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
