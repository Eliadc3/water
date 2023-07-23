// This controller handles password reset functionality, including generating a random token,
// sending a password reset email, and resetting the user's password.

const crypto = require("crypto"); // Module for cryptographic operations like random bytes and hashes
const nodemailer = require("nodemailer"); // Enables sending emails from Node.js applications using various services.
const bcrypt = require("bcrypt"); // Provides secure password hashing and comparison functions for authentication.
const User = require("../models/User_model");

// Function to generate a random token
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// Function to send a password reset email
async function sendPasswordResetEmail(user, token) {
  try {
    // Create a nodemailer transporter using Gmail as the email service
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.USER, // The Gmail email address used to send emails
        pass: process.env.PASS, // The Gmail account password
      },
    });

    // Generate the password reset link with the user's ID and the token
    const resetLink = `http://localhost:3000/reset-password/${user._id}/${token}`;

    // Send the password reset email to the user's email address
    await transporter.sendMail({
      from: process.env.USER, // The Gmail email address used to send emails
      to: user.email, // User's email address
      subject: "Password Reset Link",
      html: `<p>Hello ${user.username},</p>
            <p>You requested a password reset for your account.</p>
            <p>Please click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Link</a>`,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

// Function to handle the password reset request
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user with the given email in the database
    const user = await User.findOne({ email: email.toLowerCase() });
    const errors = [];

    if (!user) {
      errors.push({ message: "User not found." });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    // Generate a random reset token and save it to the user's document in the database
    const resetToken = generateToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token will expire in 1 hour

    await user.save();

    // Send the password reset email to the user
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res
      .status(500)
      .json({ error: "An error occurred while requesting password reset." });
  }
};

// Function to handle the password reset form submission
exports.resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { newPassword } = req.body;

    // Find the user with the given ID in the database
    const user = await User.findById(userId);
    const errors = [];

    // Check if the user exists and the reset token is valid
    if (
      !user ||
      user.passwordResetToken !== token ||
      user.passwordResetExpires < Date.now()
    ) {
      errors.push({ message: "Invalid or expired token." });
    }
    // Check if the new password meets the minimum length requirement
    if (newPassword.length < 8) {
      errors.push({ message: "Password must be at least 8 characters." });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    // Reset the user's password
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while resetting password." });
  }
};
