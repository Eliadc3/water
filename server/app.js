const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const user_router = require("./routes/user_router");
const water_router = require("./routes/water_router");

const URI = process.env.URI;
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

app.use("/user", user_router);
app.use("/water", water_router);

mongoose
  .connect(URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err.message));

app.listen(PORT || 5000, () => {
  console.log("Connection successfully");
});
