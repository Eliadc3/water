const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user_controller");

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
router.get("/users", userController.getUsers);

// Delete user
router.delete("/users/:userId", userController.deleteUser);

// Update user
router.post("/users/:userId", userController.updateUser);

// Change password
router.post("/users/:userId/change-password", userController.changePassword);

module.exports = router;
