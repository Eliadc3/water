const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user_controller");
const passwordResetController = require("../controllers/passwordResetController");

// User registration route
router.post("/register", userController.register);

// User login route
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userController.login
);

// User logout route
router.post("/logout", userController.logout);

// Get all users route
router.get("/get-users", userController.getUsers);

// Delete user
router.delete("/delete/:userId", userController.deleteUser);

// Update user
router.post("/update/:userId", userController.updateUser);

// Change password
router.post("/change-password/:userId", userController.changePassword);

// Request password reset
router.post(
  "/request-password-reset",
  passwordResetController.requestPasswordReset
);

// Reset password
router.post(
  "/reset-password/:userId/:token",
  passwordResetController.resetPassword
);

module.exports = router;
