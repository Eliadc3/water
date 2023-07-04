const mongoose = require("mongoose");

const dailyAveragesSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    average: {
      // Define the fields for average values
      Stage1_concentrate_flow_m3h: { type: Number },
      Stage2_concentrate_factor: { type: Number },
      Stage1_feed_TDS_mgl: { type: Number },
      TCF: { type: Number },
      Permeate_TDS_mgl: { type: Number },
      Stage1_pressure_drop_bar: { type: Number },
      Stage1_average_flow_m3h: { type: Number },
      Stage2_pressure_drop_bar: { type: Number },
      Stage2_average_flow_m3h: { type: Number },
      Stage1_concentrate_factor: { type: Number },
      Salt_rejection: { type: Number },
      Stage1_normalized_pressure_drop_bar: { type: Number },
      Stage2_normalized_pressure_drop_bar: { type: Number },
      Stage1_concentrate_TDS_mgl: { type: Number },
      Salt_passage: { type: Number },
      Stage1_aNDP: { type: Number },
      Stage2_aNDP: { type: Number },
      Normalized_salt_rejection: { type: Number },
      Stage1_baseline_net_permeate_flow: { type: Number },
      Stage2_baseline_net_permeate_flow: { type: Number },
    },
  },
  { versionKey: false }
);

const DailyAveragesModel = mongoose.model(
  "daily_averages",
  dailyAveragesSchema
);

module.exports = DailyAveragesModel;
