const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user_controller");
const { isAuthenticated } = require("../controllers/user_controller");

// User registration route
router.post("/register", userController.register);

// User login route
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userController.login
);

// User logout route
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  userController.logout
);

// Protected route
// router.get(
//   "/protected",
//   passport.authenticate("jwt", { session: false }),
//   userController.protected
// );

module.exports = router;
