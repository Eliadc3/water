const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User_model");
require("dotenv").config();
const validator = require("email-validator");
const { validateRegistrationInput } = require("../config/userValidation");
const passport = require("passport");

const SESSION_SECRET = process.env.SESSION_SECRET;

// User registration
exports.register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password, password2, admin } =
      req.body;
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const errors = validateRegistrationInput(
      username,
      firstname,
      lastname,
      email,
      password,
      password2
    );
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      errors.push({ message: "Username already exists." });
    }
    // Check if email is already exist
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      errors.push({
        message: "Email already exists.",
      });
    }

    // Save the user details to the database
    await User.create({
      username,
      email,
      firstname,
      lastname,
      password: hashedPassword,
      admin,
    });
    res.status(200).json({ message: "Registration successful" });
    console.log(username, email, firstname, lastname, password, admin);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// User login
exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      // Error occurred during authentication
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.status(401).json({ errors: [{ message: info.message }] });
    }

    // Authentication successful, generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SESSION_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  })(req, res, next);
};

// User logout
exports.logout = (req, res) => {
  req.logout();
  res.status(200).json({ message: "Logout successful" });
};

// Protected route
exports.protected = (req, res) => {
  res.status(200).json({ message: "Access granted to protected route" });
};
