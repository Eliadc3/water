const mongoose = require("mongoose");

const inputBaselineSchema = new mongoose.Schema({
  CIT_01: {
    type: Number,
  },
  FIT_01: {
    type: Number,
  },
  FIT_02: {
    type: Number,
  },
  FIT_03: {
    type: Number,
  },
  PIT_03: {
    type: Number,
  },
  PIT_04: {
    type: Number,
  },
  PIT_05: {
    type: Number,
  },
  PIT_06: {
    type: Number,
  },
  PIT_07: {
    type: Number,
  },
  TIT_01: {
    type: Number,
  },
  CIT_02: {
    type: Number,
  },
});

// create a model from the schema.
const InputBaselineWaterModel = mongoose.model(
  "input_baseline_data",
  inputBaselineSchema
);

module.exports = InputBaselineWaterModel;
