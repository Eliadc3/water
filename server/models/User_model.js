const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      description: "Username of the user",
      required: true,
      lowecase: true,
    },
    firstname: {
      type: String,
      trim: true,
      description: "First name",
      required: true,
      set: (value) => {
        const words = value.split(" ");
        const capitalizedWords = words.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        return capitalizedWords.join(" ");
      },
    },
    lastname: {
      type: String,
      trim: true,
      description: "Last name",
      required: true,
      set: (value) => {
        const words = value.split(" ");
        const capitalizedWords = words.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        return capitalizedWords.join(" ");
      },
    },
    email: {
      type: String,
      unique: true,
      description: "Email of the user",
      trim: true,
      required: true,
      lowecase: true,
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

// Pre hook to convert username to lowercase before saving
userSchema.pre("save", function (next) {
  this.username = this.username.toLowerCase();
  this.email = this.email.toLowerCase();

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
