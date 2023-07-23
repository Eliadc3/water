// This controller handles users functions - register, login, logout, get users, delete user, update user and change password.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jwt for generating and verifying JSON Web Tokens
const User = require("../models/User_model");
require("dotenv").config();
const validator = require("email-validator");
const {
  validateRegistrationInput,
  validateUpdateForm,
  validateChangePassword,
} = require("../config/userValidation"); // Import validation functions
const passport = require("passport"); // Authentication middleware

// Get the session secret from environment variables
const SESSION_SECRET = process.env.SESSION_SECRET;

// Function to handle user registration
exports.register = async (req, res) => {
  try {
    // Extract user registration data from request body
    const { username, firstname, lastname, email, password, password2, admin } =
      req.body;

    // Generate a salt and hash the user's password
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Validate user registration input
    const errors = validateRegistrationInput(
      username,
      firstname,
      lastname,
      email,
      password,
      password2
    );

    // Convert username and email to lowercase for case-insensitive comparison
    const lowerCaseUsername = username.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();

    // Check if the username or email is already taken by another user
    const checkUser = await User.findOne({
      $or: [{ username: lowerCaseUsername }, { email: lowerCaseEmail }],
    });

    // If user already exists, add appropriate error messages
    if (checkUser) {
      if (checkUser.username === lowerCaseUsername) {
        errors.push({ message: "Username already exists." });
      }
      if (checkUser.email === lowerCaseEmail) {
        errors.push({ message: "Email already exists." });
      }
    }

    // If there are validation errors, return the errors as response
    if (errors.length > 0) {
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
  } catch (error) {
    res.status(500).json({ error: "An error occurred, registration failed." });
  }
};

// Function to handle user login
exports.login = (req, res, next) => {
  // Authenticate user using passport's local strategy
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      // Error occurred during authentication, pass it to the next middleware
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.status(401).json({ errors: [{ message: info.message }] });
    }

    // Authentication successful, generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SESSION_SECRET,
      { expiresIn: "5m" }
    );

    // Extract user's admin status and username
    const admin = user.admin;
    const username = user.username;

    // Return the token and user information as response
    res.status(201).json({ token, admin, username });
  })(req, res, next);
};

// Function to handle user logout
exports.logout = (req, res) => {
  // Logout the user using passport's logout method
  req.logout();
  res.status(201).json({ message: "Logout successful" });
};

// Function to fetch all users from the database
exports.getUsers = async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();

    // Return the list of users as response
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

// Function to delete a user by their ID
exports.deleteUser = async (req, res) => {
  // Extract user ID from request parameters
  const { userId } = req.params;
  try {
    // Find and delete the user by their ID
    await User.findByIdAndDelete(userId);
    res.status(201).json({ message: "User deleted succssfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while deleting the user." });
  }
};

// Function to update user details
exports.updateUser = async (req, res) => {
  // Extract user ID from request parameters
  const { userId } = req.params;

  // Extract updated user details from request body
  const { username, firstname, lastname, email, admin } = req.body;

  // Convert username and email to lowercase for case-insensitive comparison
  const lowerCaseUsername = username.toLowerCase();
  const lowerCaseEmail = email.toLowerCase();

  // Find the user by their ID
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  try {
    // Validate user details update input
    const errors = validateUpdateForm(username, firstname, lastname, email);

    // Check if the username or email is already taken by another user
    const checkUser = await User.findOne({
      $or: [{ username: lowerCaseUsername }, { email: lowerCaseEmail }],
      _id: { $ne: userId }, // Exclude the user's own record using _id: { $ne: userId }
    });

    // If username or email already taken, add appropriate error messages
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

    // Update the user's details with the new values
    const user = await User.findByIdAndUpdate(
      userId,
      { username, firstname, lastname, email, admin },
      { new: true } // Set { new: true } to return the updated user
    );

    // If there are validation errors, return the errors as response
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Return success message and the updated user
    res.status(201).json({ message: "User updated successfully.", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the user." });
  }
};

// Function to change a user's password
exports.changePassword = async (req, res) => {
  // Extract user ID from request parameters
  const { userId } = req.params;

  // Extract old and new passwords from request body
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // Validate the old and new passwords
    const errors = validateChangePassword(oldPassword, newPassword);

    // If user does not exist, add appropriate error message
    if (!user) {
      errors.push({ message: "User not found." });
    }

    // Check if the old password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      errors.push({ message: "Invalid old password." });
    }

    // If there are validation errors, return the errors as response
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Generate a salt and hash the new password
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password with the new hashed password
    user.password = hashedPassword;
    await user.save();
    res.status(201).json({ message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while changing the password." });
  }
};
