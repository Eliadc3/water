const moment = require("moment");
const DailyAveragesModel = require("../models/Daily_Water_data_model");
const WeeklyAveragesModel = require("../models/Weekly_Water_data_model");

exports.calculateWeeklyAverages = async (data) => {
  try {
    const weeklyAverages = {};
    data.forEach((record) => {
      const weekNumber = moment(record.date, "YYYY-MM-DD").isoWeek();
      if (!weeklyAverages[weekNumber]) {
        weeklyAverages[weekNumber] = {
          count: 0,
          total: { ...record.average },
        };
      } else {
        const weeklyTotal = weeklyAverages[weekNumber].total;
        for (const field in weeklyTotal) {
          if (field !== "index" && field !== "Time") {
            weeklyTotal[field] += record.average[field];
          }
        }
      }
      weeklyAverages[weekNumber].count++;
    });

    for (const weekNumber in weeklyAverages) {
      const count = weeklyAverages[weekNumber].count;
      const weekAverage = weeklyAverages[weekNumber].total;
      for (const field in weekAverage) {
        if (field !== "index" && field !== "Time") {
          weekAverage[field] /= count;
        }
      }
    }

    const weeklyAveragesArray = Object.keys(weeklyAverages).map(
      (weekNumber) => {
        return {
          week: parseInt(weekNumber),
          average: weeklyAverages[weekNumber].total,
        };
      }
    );

    await WeeklyAveragesModel.insertMany(weeklyAveragesArray);

    console.log("Weekly averages calculated and saved successfully");
  } catch (err) {
    console.error("Error calculating weekly averages:", err);
  }
};
