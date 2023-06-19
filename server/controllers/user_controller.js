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
    const lowerCaseUsername = username.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();

    const checkUser = await User.findOne({
      $or: [{ username: lowerCaseUsername }, { email: lowerCaseEmail }],
    });
    if (checkUser) {
      const errors = [];
      if (checkUser.username === lowerCaseUsername) {
        errors.push({ message: "Username already exists." });
      }
      if (checkUser.email === lowerCaseEmail) {
        errors.push({ message: "Email already exists." });
      }
      return res.status(400).json({ errors });
    }

    // Save the user details to the database
    await User.create({
      username: lowerCaseUsername,
      email: lowerCaseEmail,
      firstname,
      lastname,
      password: hashedPassword,
      admin,
    });
    res.status(201).json({ message: "Registration successful" });
    console.log(username, email, firstname, lastname, password, admin);
  } catch (error) {
    res.status(500).json({ error: "An error occurred, registration failed." });
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

    const admin = user.admin;

    res.status(201).json({ token, admin });
  })(req, res, next);
};

// User logout
exports.logout = (req, res) => {
  req.logout();
  res.status(201).json({ message: "Logout successful" });
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    res.status(201).json({ message: "User deleted succssfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while deleting the user." });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, firstname, lastname, email, admin } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username, firstname, lastname, email, admin },
      { new: true }
    );

    if (user) {
      res.status(201).json({ message: "User updated successfully.", user });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the user." });
  }
};

// exports.changePassword = async (req, res) => {
//   const { userId } = req.params;
//   const { oldPassword, newPassword } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }
//     const passwordMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!passwordMatch) {
//       return res.status(400).json({ message: "Invalid old password" });
//     }
//     const saltRounds = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     user.password = hashedPassword;
//     await user.save();
//     res.status(201).json({ message: "Password changed successfully." });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "An error occurred while changing the password." });
//   }
// };
