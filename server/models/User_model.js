const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      description: "Username of the user",
      required: true,
    },
    email: {
      type: String,
      unique: true,
      description: "Email of the user",
      trim: true,
      required: true,
    },
    password: {
      type: String,
      description: "Password of the user",
      minLength: 8,
      required: true,
      trim: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
