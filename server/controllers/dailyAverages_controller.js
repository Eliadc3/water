const moment = require("moment");
const DailyAveragesModel = require("../models/Daily_Water_data_model");

exports.calculateDailyAverages = async (data) => {
  try {
    const dailyAverages = {};
    data.forEach((record) => {
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
        }
      }
    }

    const dailyAveragesData = Object.keys(dailyAverages).map((date) => ({
      date,
      average: dailyAverages[date].total,
    }));

    await DailyAveragesModel.insertMany(dailyAveragesData);

    console.log("Daily averages calculated and saved successfully");
  } catch (err) {
    console.error("Error calculating daily averages:", err);
  }
};
