const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const user_router = require("./routes/user_router");
const water_router = require("./routes/water_router");

const URI = process.env.URI;
const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
mongoose
  .connect(URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err.message));

app.use("/users", user_router);
app.use("/water", water_router);

app.listen(PORT || 5000, () => {
  console.log("Connection successfully : port 5000");
});
