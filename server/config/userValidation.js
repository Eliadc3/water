// The code contains functions to validate registration input, update form input, and change password
// input.

const validator = require("email-validator");

// Function to check if a string contains numbers
function containsNumbers(input) {
  return /\d/.test(input);
}

// Function to validate if an email address is in a valid format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate user registration input data
function validateRegistrationInput(
  username,
  firstname,
  lastname,
  email,
  password,
  password2
) {
  let errors = [];

  // Trim leading and trailing spaces from username and email
  username = username.trim();
  email = email.trim();

  // Check if all required fields are filled
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
  // Validate username dosen't have spaces
  if (/\s/.test(username)) {
    errors.push({ message: "Username cannot contain spaces." });
  }
  // Check if the username input is more than 2 chars
  if (username.length < 2) {
    errors.push({ message: "Username has to be at least 2 characters." });
  }
  // Check if the username input is maximum 12 chars
  if (username.length > 12) {
    errors.push({ message: "Username has to be maximum 12 characters." });
  }

  // Check if the first name contains numbers
  if (containsNumbers(firstname)) {
    errors.push({ message: "First name cannot contain numbers." });
  }

  // Check if the last name contains numbers
  if (containsNumbers(lastname)) {
    errors.push({ message: "Last name cannot contain numbers." });
  }

  // Check if the first name is more than 2 chars
  if (firstname.length < 2) {
    errors.push({
      message: "First name hase to be at least 2 characters.",
    });
  }

  // Check if the first name is maximum 12 chars
  if (firstname.length > 12) {
    errors.push({
      message: "First name hase to be maximum 12 characters.",
    });
  }

  // Check if the last name is more than 2 chars
  if (lastname.length < 2) {
    errors.push({
      message: "Last name has to be at least 2 characters.",
    });
  }

  // Check if the last name is maximum 12 chars
  if (lastname.length > 12) {
    errors.push({
      message: "Last name has to be maximum 12 characters.",
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
  if (!isValidEmail(email)) {
    errors.push({ message: "Invalid email address." });
  }
  // Validate username dosen't have spaces
  else if (/\s/.test(email)) {
    errors.push({ message: "Email cannot contain spaces." });
  }

  return errors;
}

const validateUpdateForm = (username, firstname, lastname, email) => {
  const errors = [];

  // Trim spaces at the beginning and end of the input fields
  username = username.trim();
  email = email.trim();

  // Validate username
  if (/\s/.test(username)) {
    errors.push({ message: "Username cannot contain spaces." });
  }

  // Check if the email is valid
  if (!isValidEmail(email)) {
    errors.push({ message: "Invalid email address." });
  }
  // Validate username dosen't have spaces
  else if (/\s/.test(email)) {
    errors.push({ message: "Email cannot contain spaces." });
  }

  // Check if there is input
  if (!username || !email || !firstname || !lastname) {
    errors.push({ message: "You must fill all the fields." });
  }

  // Check if the username input is more than 2 chars
  if (username.length < 2) {
    errors.push({ message: "Username has to be at least 2 characters." });
  }
  // Check if the username input is maximum 12 chars
  if (username.length > 12) {
    errors.push({ message: "Username has to be maximum 12 characters." });
  }

  // Check if the first name contains numbers
  if (containsNumbers(firstname)) {
    errors.push({ message: "First name cannot contain numbers." });
  }

  // Check if the last name contains numbers
  if (containsNumbers(lastname)) {
    errors.push({ message: "Last name cannot contain numbers." });
  }

  // Check if the first name is more than 2 chars
  if (firstname.length < 2) {
    errors.push({ message: "First name has to be at least 2 characters." });
  }

  // Check if the first name is maximum 12 chars
  if (firstname.length > 12) {
    errors.push({ message: "First name has to be maximum 12 characters." });
  }

  // Check if the last name is more than 2 chars
  if (lastname.length < 2) {
    errors.push({ message: "Last name has to be at least 2 characters." });
  }

  // Check if the last name is maximum 12 chars
  if (lastname.length > 12) {
    errors.push({ message: "Last name has to be maximum 12 characters." });
  }

  return errors;
};

const validateChangePassword = (oldPassword, newPassword) => {
  const errors = [];

  // Check if there is input
  if (!oldPassword || !newPassword) {
    errors.push({ message: "You must fill all the fields." });
  }

  // Check if password matches conditions
  if (newPassword.length < 8) {
    errors.push({ message: "Password must be at least 8 characters." });
  }
  return errors;
};

module.exports = {
  validateRegistrationInput,
  validateUpdateForm,
  validateChangePassword,
};
