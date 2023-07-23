const passport = require("passport"); // The main Passport module that handles authentication.
const bcrypt = require("bcrypt"); // A library used for password hashing and comparing hashed passwords.
const jwtStrategy = require("passport-jwt").Strategy; // JWT strategy for handling JSON Web Token authentication.
const ExtractJwt = require("passport-jwt").ExtractJwt; // Helper to extract JWT from the request.
const LocalStrategy = require("passport-local").Strategy; // Local strategy for handling username and password authentication.

const User = require("../models/User_model");

require("dotenv").config(); // Load environment variables from the .env file.
const SESSION_SECRET = process.env.SESSION_SECRET; // Get the session secret from the environment.

// JWT Strategy Configuration
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header.
  secretOrKey: SESSION_SECRET, // Use the session secret to verify the JWT signature.
};

// Passport Configuration Function
module.exports = (passport) => {
  // Configure the JWT strategy to authenticate incoming requests with a JWT.
  passport.use(
    new jwtStrategy(options, async (jwtPayload, done) => {
      try {
        // Find the user in the database using the user ID from the JWT payload.
        const user = await User.findById(jwtPayload.id);
        if (user) {
          // If the user is found, return the user object as authenticated.
          return done(null, user);
        } else {
          // If the user is not found, return false as unauthenticated.
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );

  // Configure the Local strategy to authenticate users with a username or email and password.
  passport.use(
    new LocalStrategy(
      {
        usernameField: "usernameOrEmail", // Define the field used for the username or email.
        passwordField: "password", // Define the field used for the password.
      },
      async (usernameOrEmail, password, done) => {
        try {
          // Find the user in the database using either username or email.
          const user = await User.findOne().or([
            { username: usernameOrEmail },
            { email: usernameOrEmail },
          ]);
          if (!user) {
            // User not found, return error
            return done(null, false, {
              message: "Incorrect username or email.",
            });
          }
          // Compare the provided password with the hashed password in the database.
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            // Incorrect password, return error
            return done(null, false, { message: "Incorrect password" });
          }
          // If the user is authenticated successfully, return the user object.
          return done(null, user);
        } catch (error) {
          // Error occurred during authentication, return error
          return done(error);
        }
      }
    )
  );
};
