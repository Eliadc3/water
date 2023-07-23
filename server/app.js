// This code sets up a Node.js server using the Express framework to handle user and water-related routes. It establishes a connection to MongoDB using Mongoose for database operations. The server listens on a specified port, and CORS middleware is used to allow requests from a specific origin. Passport middleware is also configured for authentication. The routes for users and water data are mounted to specific paths.

const cors = require("cors"); // Cross-Origin Resource Sharing middleware
const mongoose = require("mongoose"); // MongoDB object modeling tool
const express = require("express"); // Web application framework for Node.js
const bodyParser = require("body-parser"); // Middleware for parsing request bodies
const passport = require("passport"); // Authentication middleware
const user_router = require("./routes/user_router"); // User-related routes
const water_router = require("./routes/water_router"); // Water-related routes
require("dotenv").config(); // Load environment variables from .env file
const DB = process.env.DB; // MongoDB connection string from environment variables

// Create an instance of the Express application
const app = express();

// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON data
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (e.g., cookies) to be sent with the request
  })
);

// Connect to MongoDB
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.log("Error connecting to MongoDB: " + error.message)
  );

// Passport configuration
require("./config/passport")(passport);

// Routes
app.use("/users", user_router); // Mount user-related routes
app.use("/water", water_router); // Mount water-related routes

const PORT = process.env.PORT; // Port number from environment variables

// Start the server and listen for incoming requests
app.listen(PORT || 5000, () => {
  console.log("Connection successfully : ", PORT);
});
