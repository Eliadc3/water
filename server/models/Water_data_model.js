const mongoose = require("mongoose");

// const waterSchema = new mongoose.Schema({
//   Time: {
//     type: String,
//   },
//   CIT_01: {
//     type: String,
//   },
//   TIT_01: {
//     type: String,
//   },
//   PIT_03: {
//     type: String,
//   },
//   PIT_04: {
//     type: String,
//   },
//   Stage1_Pressure_Drop: {
//     type: String,
//   },
//   PIT_05: {
//     type: String,
//   },
//   PIT_06: {
//     type: String,
//   },
//   Stage2_Pressure_Drop: {
//     type: String,
//   },
//   FIT_03: {
//     type: String,
//   },
//   CIT_02: {
//     type: String,
//   },
//   PIT_07: {
//     type: String,
//   },
//   FIT_02: {
//     type: String,
//   },
//   FIT_01: {
//     type: String,
//   },
// });

const waterSchema = new mongoose.Schema({
  Stage1_concentrate_flow_m3h: {
    type: Number,
  },
  Stage2_concentrate_factor: {
    type: Number,
  },
  Stage1_feed_TDS_mgl: {
    type: Number,
  },
  TCF: {
    type: Number,
  },
  Permeate_TDS_mgl: {
    type: Number,
  },
  Stage1_pressure_drop_bar: {
    type: Number,
  },
  Stage1_average_flow_m3h: {
    type: Number,
  },
  Stage2_pressure_drop_bar: {
    type: Number,
  },
  Stage2_average_flow_m3h: {
    type: Number,
  },
  Stage1_concentrate_factor: {
    type: Number,
  },
  Salt_rejection: {
    type: Number,
  },
  Stage1_normalized_pressure_drop_bar: {
    type: Number,
  },
  Stage2_normalized_pressure_drop_bar: {
    type: Number,
  },
  Stage1_concentrate_TDS_mgl: {
    type: Number,
  },
  Salt_passage: {
    type: Number,
  },
  Stage1_aNDP: {
    type: Number,
  },
  Stage2_aNDP: {
    type: Number,
  },
  Normalized_salt_rejection: {
    type: Number,
  },
  Stage1_baseline_net_permeate_flow: {
    type: Number,
  },
  Stage2_baseline_net_permeate_flow: {
    type: Number,
  },
});

// create a model from the schema.
const WaterModel = mongoose.model("PreData", waterSchema);

module.exports = WaterModel;
