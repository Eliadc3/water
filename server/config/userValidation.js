const validator = require("email-validator");

function validateRegistrationInput(
  username,
  firstname,
  lastname,
  email,
  password,
  password2
) {
  let errors = [];

  // Check if there is input
  if (
    !username ||
    !email ||
    !firstname ||
    !lastname ||
    !password ||
    !password2
  ) {
    errors.push({ message: "You must fill all the fields." });
  }

  // Check if the username input is more than 2 chars
  if (username.length < 2) {
    errors.push({ message: "Username has to be at least 2 characters." });
  }
  // Check if the first and last name is more than 2 chars each
  if (firstname.length < 2 && lastname.length < 2) {
    errors.push({
      message:
        "first name and last name have to be at least 2 characters each.",
    });
  }

  /* Check whether password and password2 match or not */
  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  // Check if password matches conditions
  if (password.length < 8) {
    errors.push({ message: "Password must be at least 8 characters." });
  }

  // Check if the email is valid
  if (!validator.validate(email)) {
    errors.push({ message: "Invalid email address." });
  }

  return errors;
}

module.exports = {
  validateRegistrationInput,
};
