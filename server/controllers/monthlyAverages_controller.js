const moment = require("moment");
const DailyAveragesModel = require("../models/Daily_Water_data_model");
const MonthlyAveragesModel = require("../models/Monthly_Water_data_model");

exports.calculateMonthlyAverages = async (data) => {
  try {
    const monthlyAverages = {};
    data.forEach((record) => {
      const monthYear = moment(record.date, "YYYY-MM-DD").format("MM-YYYY");
      if (!monthlyAverages[monthYear]) {
        monthlyAverages[monthYear] = {
          count: 0,
          total: { ...record.average },
        };
      } else {
        const monthlyTotal = monthlyAverages[monthYear].total;
        for (const field in monthlyTotal) {
          if (field !== "index" && field !== "Time") {
            monthlyTotal[field] += record.average[field];
          }
        }
      }
      monthlyAverages[monthYear].count++;
    });

    for (const monthYear in monthlyAverages) {
      const count = monthlyAverages[monthYear].count;
      const monthAverage = monthlyAverages[monthYear].total;
      for (const field in monthAverage) {
        if (field !== "index" && field !== "Time") {
          monthAverage[field] /= count;
        }
      }
    }

    const monthlyAveragesArray = Object.keys(monthlyAverages).map(
      (monthYear) => {
        return {
          monthYear,
          average: monthlyAverages[monthYear].total,
        };
      }
    );

    await MonthlyAveragesModel.insertMany(monthlyAveragesArray);

    console.log("Monthly averages calculated and saved successfully");
  } catch (err) {
    console.error("Error calculating monthly averages:", err);
  }
};
