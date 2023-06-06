const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
require("dotenv").config();

const passport = require("passport");
require("./config/passport")(passport);

const URI = process.env.URI;
const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const user_router = require("./routes/user_router");
const water_router = require("./routes/water_router");

app.use(express.json());
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: " + err.message));

/* Initializing the path for routes */
//app.use("/", require("./routes"));
app.use("/users", user_router);
app.use("/water", water_router);

app.listen(PORT || 5000, () => {
  console.log("Connection successfully : port 5000");
});
