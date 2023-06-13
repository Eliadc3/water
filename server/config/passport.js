const passport = require("passport");
const bcrypt = require("bcrypt");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User_model");

require("dotenv").config();
const SESSION_SECRET = process.env.SESSION_SECRET;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SESSION_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new jwtStrategy(options, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "usernameOrEmail",
        passwordField: "password",
      },
      async (usernameOrEmail, password, done) => {
        try {
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
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            // Incorrect password, return error
            return done(null, false, { message: "Incorrect password" });
          }
          return done(null, user);
        } catch (error) {
          // Error occurred during authentication, return error
          return done(error);
        }
      }
    )
  );
};
