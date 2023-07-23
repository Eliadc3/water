import React, { useRef, useState, useEffect } from "react";
import styles from "../css/UserForm.module.css";
import axios from "axios";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

// The RegisterPage component is a form that allows admin users to register or edit user information,
// including username, email, first name, last name, password, and admin status.

const RegisterPage = ({
  onSuccess,
  onClose,
  selectedUser,
  setNotification,
}) => {
  // State to manage the form input fields
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [admin, setAdmin] = useState(false);

  // Ref to the form element
  const formRef = useRef(null);

  // State to toggle showing/hiding the password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // State to store validation errors (if any)
  const [errors, setErrors] = useState([]);

  // Update the state with the data of the selected user (if provided)
  useEffect(() => {
    if (selectedUser) {
      setUsername(selectedUser.username);
      setFirstname(selectedUser.firstname);
      setLastname(selectedUser.lastname);
      setEmail(selectedUser.email);
      setAdmin(selectedUser.admin);
    }
  }, [selectedUser]);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { id, value } = event.target;

    // Update the corresponding state based on the input id
    if (id === "username") {
      setUsername(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "firstname") {
      setFirstname(value);
    }
    if (id === "lastname") {
      setLastname(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "password2") {
      setPassword2(value);
    }
  };

  // Handle checkbox change for admin role
  const handleAdminChange = (event) => {
    const { checked, id } = event.target;
    if (id === "admin") {
      setAdmin(checked);
    }
  };

  // Handle form submission for user registration or update
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let res;
      if (selectedUser) {
        // Update existing user
        res = await axios.post(
          `http://localhost:5000/users/update/${selectedUser._id}`,
          {
            username,
            firstname,
            lastname,
            email,
            admin,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } else {
        // Create new user
        res = await axios.post(
          "http://localhost:5000/users/register",
          {
            username,
            firstname,
            lastname,
            email,
            password,
            password2,
            admin,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      }

      // Handle the response after user creation/update
      if (res.status === 201) {
        onClose(); //Close the register form
        setNotification("User updated successfully.");
        onSuccess(); // Call the onSuccess prop to trigger data refresh in the parent component
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setNotification(error.response.data.message);
      }

      console.error(error);
    }
  };

  // Handle closing the registration form
  const handleCloseForm = () => {
    onClose(); // Call the onClose prop to close the form in the parent component
  };

  // Toggle showing/hiding the password field
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // Toggle showing/hiding the confirm password field
  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <div className={styles.loginForm} ref={formRef}>
      <div className={styles.formName}>
        {selectedUser ? "Edit User" : "Create User"}
      </div>
      <form className="form-body" onSubmit={handleSubmit}>
        {/* Display errors (if any) */}
        {errors.length > 0 && (
          <div className={styles.errorContainer}>
            <div className={styles.errorTitle}>
              <h3>ERRORS</h3>
            </div>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Input field for username */}
        <div className="username">
          <input
            type="text"
            title="Username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Input field for email */}
        <div className="email">
          <input
            type="text"
            title="Email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Input field for first name */}
        <div className="firstname">
          <input
            type="text"
            title="First name"
            id="firstname"
            placeholder="First name"
            value={firstname}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Input field for last name */}
        <div className="lastname">
          <input
            type="text"
            title="Last name"
            id="lastname"
            placeholder="Last name"
            value={lastname}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Render password fields only for new user registration */}
        {!selectedUser && (
          <div className={styles.passwordContainer}>
            {/* Input field for password */}
            <div className="password">
              <input
                type={showPassword ? "text" : "password"}
                title="Password"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowPassword}
              >
                {showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
        )}
        {/* Input field for password confirmation */}
        {!selectedUser && (
          <div className={styles.passwordContainer}>
            <div className="password2">
              <input
                type={showPassword2 ? "text" : "password"}
                title="Confirm Password"
                id="password2"
                placeholder="Confirm Password"
                value={password2}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowPassword2}
              >
                {showPassword2 ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
        )}
        {/* Input field for admin checkbox */}
        <div>
          <label htmlFor="admin">
            <input
              className={styles.admin}
              type="checkbox"
              id="admin"
              checked={admin}
              onChange={handleAdminChange}
            />
            Create as Admin
          </label>
        </div>
        {/* Submit and cancel buttons */}
        <button type="submit" className={styles.btn}>
          {selectedUser ? "Save Changes" : "Create User"}
        </button>
        <button type="button" onClick={handleCloseForm} className={styles.btn}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
