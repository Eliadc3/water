const jwt = require("jsonwebtoken");
const User = require("../models/User_model");
const validator = require("email-validator");
const bcrypt = require("bcrypt");

// Middleware function to check admin access
exports.isAdmin = (req, res, next) => {
  // Check if the current user is an admin
  if (req.user && req.user.isAdmin) {
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
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;

  console.log("Request received: ", req.body);
  let user;

  try {
    // Check if there is input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "You must fill all the fields." });
    }

    // Check if the input is more than 2 chars
    if (username.length < 2) {
      return res
        .status(400)
        .json({ message: "Username has to be at least 2 characters." });
    }

    // Check if password match for contidions
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password has to be at least 8 characters." });
    }

    // Check if the email is valid
    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Check if username is already exist
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }
    // Check if email is already exist
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "Email adress already exists, try another email." });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user object
    user = new User({
      username,
      email,
      password: hashPassword,
      isAdmin,
    });

    // Save to DB
    await user.save();

    console.log("User created successfully: ", user);

    // Add additional logic to assign admin privileges or roles
    if (isAdmin) {
      console.log("User is registered as admin");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!user) {
    return res.status(500).json({ message: "Error. User not created." });
  }
  return res.status(201).json({ message: "User created successfully.", user });
};
