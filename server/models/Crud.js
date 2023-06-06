const mongoose = require("mongoose");

/* Creating the schema with username, identifier, firstName, lastName and updated */

const crud = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  identifier: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

/* Exporting schema with collection as CrudOperations */
module.exports = mongoose.model("CrudOperations", crud);
