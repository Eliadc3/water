import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

import styles from "../css/UserForm.module.css";
import notifStyles from "../css/Notifications.module.css";
import axios from "axios";
import Cookies from "js-cookie";

import PasswordResetRequest from "./PasswordResetRequest";

// The LoginPage code is a component for a login page that handles user authentication and displays
// a form for users to enter their username/email and password.

const LoginPage = ({ checkAuthentication }) => {
  // State to manage user inputs
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // State for showing/hiding password reset form
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);

  // State for displaying bad notifications (error messages)
  const [badNotification, setBadNotification] = useState(null);

  // State to store login errors
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  // Function to handle input changes
  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "usernameOrEmail") {
      setUsernameOrEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
  };

  // UseEffect to handle the fadeout of bad notifications after 5 seconds
  useEffect(() => {
    if (badNotification) {
      const timer = setTimeout(() => {
        setBadNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badNotification]);

  // Function to handle form submission (login)
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/users/login",
        {
          usernameOrEmail: usernameOrEmail.toLowerCase(),
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        const hours = 1; // Set the expiration time for the cookie
        // Save user details as cookies for authentication
        Cookies.set("token", res.data.token, {
          expires: hours / 24,
        });
        Cookies.set("admin", res.data.admin, {
          expires: hours / 24,
        });
        Cookies.set("username", res.data.username, {
          expires: hours / 24,
        });

        // Check authentication status and redirect to the dashboard page
        checkAuthentication();
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setErrors([
          {
            message: "Invalid username/email or password.",
          },
        ]);
        setBadNotification("Invalid username/email or password.");
      } else {
        setErrors([
          {
            message: "An error occurred. Please try again.",
          },
        ]);
        setBadNotification("An error occurred. Please try again.");
      }
      console.error(error);
    }
  };

  // Function to toggle showing/hiding the password
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to toggle showing/hiding the password reset form
  const toggleShowPasswordResetForm = () => {
    setShowPasswordResetForm(!showPasswordResetForm);
  };

  return (
    <div>
      {/* Display bad notifications (error messages) */}
      {badNotification && (
        <div className={notifStyles.notificationContainer}>
          <div className={notifStyles.notificationBox}>
            <div
              className={`${notifStyles.badnotification} ${
                badNotification.fadeOut ? notifStyles.fadeOut : ""
              }`}
            >
              {badNotification}
            </div>
          </div>
        </div>
      )}
      <div>
        {/* If the password reset form is shown, display the PasswordResetRequest component*/}
        {showPasswordResetForm ? (
          <PasswordResetRequest />
        ) : (
          // If the password reset form is not shown, display the login form
          <div
            className={styles.loginForm}
            style={{
              color: "white",
            }}
          >
            <div className={styles.formName}>Login</div>
            <form className="form-body" onSubmit={handleSubmit}>
              {errors.length > 0 && (
                // Display login errors (if any)
                <div className={styles.errorContainerLogin}>
                  <div className={styles.errorTitle}></div>
                  <ul className={styles.no_bullets}>
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="usernameOrEmail">
                <input
                  type="text"
                  id="usernameOrEmail"
                  placeholder="Username or Email"
                  value={usernameOrEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={toggleShowPassword}
                >
                  {/* Show/hide password icon */}
                  {showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
                </button>
              </div>
              {/* Submit and "Forgot Password" buttons */}
              <button type="submit" className={styles.btn}>
                submit
              </button>

              <button
                type="button"
                className={styles.btn}
                onClick={toggleShowPasswordResetForm}
              >
                Forgot Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
