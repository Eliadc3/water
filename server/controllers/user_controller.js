const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("email-validator");

// Load User model
const User = require("../models/User_model");

// Middleware function to check admin access
exports.isAdmin = (req, res, next) => {
  // Check if the current user is an admin
  if (req.user && req.user.admin) {
    // User is an admin, proceed to the next middleware or route handler
    next();
  } else {
    // User is not an admin, return an error response
    res
      .status(403)
      .json({ message: "Access denied. Admin permission required." });
  }
};

exports.register = async (req, res) => {
  // const username = req.body.username;
  // const email = req.body.email;
  // const password = req.body.password;
  const { username, email, password, password2, admin } = req.body;

  let errors = [];

  console.log("Request received: ", JSON.stringify(req.body));
  let newUser;

  try {
    // Check if there is input
    if (!username || !email || !password || !password2) {
      errors.push({ message: "You must fill all the fields." });
    }

    // Check if the input is more than 2 chars
    if (username.length < 2) {
      errors.push({ message: "Username has to be at least 2 characters." });
    }

    /* Check whether password and password2 matches or not */
    if (password != password2) {
      errors.push({ message: "Passwords do not match" });
    }

    // Check if password match for contidions
    if (password.length < 8) {
      errors.push({ message: "Password must be at least 8 characters." });
    }

    // Check if the email is valid
    if (!validator.validate(email)) {
      errors.push({ message: "Invalid email address." });
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
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    // Encrypt password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user object
    newUser = new User({
      username,
      email,
      password: hashPassword,
      admin,
    });

    // Save to DB
    await newUser.save();

    console.log("User created successfully: ", newUser);

    // Add additional logic to assign admin privileges or roles
    if (admin) {
      console.log("User is registered as admin");
    }
    return res
      .status(201)
      .json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error. User not created." });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error in Login" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Username or password is incorrect." });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error in Login" });
      }
      return res.send("Login Successful");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
    }
    // Logging out
    res.send("User Logout");
    //res.redirect("/users/"); // Redirect the user to a desired page after logout
  });
};
