const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
  time: {
    type: String,
  },
  CIT_01: {
    type: Number,
  },
  TIT_01: {
    type: Number,
  },
  PIT_03: {
    type: Number,
  },
  PIT_04: {
    type: Number,
  },
  Stage1_Pressure_Drop: {
    type: Number,
  },
  PIT_05: {
    type: Number,
  },
  PIT_06: {
    type: Number,
  },
  Stage2_Pressure_Drop: {
    type: Number,
  },
  FIT_03: {
    type: Number,
  },
  CIT_02: {
    type: Number,
  },
  PIT_07: {
    type: Number,
  },
  FIT_02: {
    type: Number,
  },
  FIT_01: {
    type: Number,
  },
});

// create a model from the schema.
const Water = mongoose.model("Water", waterSchema);

// export the Song model so index.js will be able to use it
module.exports = Water;
