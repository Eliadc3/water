const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const user_router = require("./routes/user_router");
const water_router = require("./routes/water_router");
require("dotenv").config();
const DB = process.env.DB;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.log("Error connecting to MongoDB: " + error.message)
  );

// Passport configuration
require("./config/passport")(passport);

// Routes
app.use("/users", user_router);
app.use("/water", water_router);

const PORT = process.env.PORT;

// Start the server
app.listen(PORT || 5000, () => {
  console.log("Connection successfully : ", PORT);
});
