const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
  Time: {
    type: String,
  },
  CIT_01: {
    type: String,
  },
  TIT_01: {
    type: String,
  },
  PIT_03: {
    type: String,
  },
  PIT_04: {
    type: String,
  },
  Stage1_Pressure_Drop: {
    type: String,
  },
  PIT_05: {
    type: String,
  },
  PIT_06: {
    type: String,
  },
  Stage2_Pressure_Drop: {
    type: String,
  },
  FIT_03: {
    type: String,
  },
  CIT_02: {
    type: String,
  },
  PIT_07: {
    type: String,
  },
  FIT_02: {
    type: String,
  },
  FIT_01: {
    type: String,
  },
});

// create a model from the schema.
const WaterModel = mongoose.model("PreData", waterSchema);

module.exports = WaterModel;
