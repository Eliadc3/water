// The `PasswordResetPage` is a component for a password reset page that allows users to reset their
// password by entering a new password and confirming it.

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../css/UserForm.module.css";
import notifStyles from "../css/Notifications.module.css";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

const PasswordResetPage = () => {
  // State to manage the user's new password input
  const [newPassword, setNewPassword] = useState("");

  // State to manage the user's password confirmation input
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for displaying notification (success message)
  const [notification, setNotification] = useState(null);

  // Extract `userId` and `token` from the URL params using the `useParams` hook
  const { userId, token } = useParams();

  // State for handling redirect after successful password reset
  const [redirect, setRedirect] = useState(false);

  // State to store errors (if any)
  const [errors, setErrors] = useState([]);

  // State to toggle showing/hiding the new and confirm passwords
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to handle form submission (password reset)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = [];

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setErrors([
        {
          message: "Password do not match",
        },
      ]);
      return;
    }
    try {
      // Send the password reset request to the server with the `userId` and `token`
      const response = await axios.post(
        `http://localhost:5000/users/reset-password/${userId}/${token}`,
        {
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setErrors([]);
      if (response.status === 200) {
        setNotification(
          "Password reset successful. You can now login with your new password."
        );
      }

      // Redirect to the login page after 5 seconds
      setTimeout(() => {
        setRedirect(true);
      }, 5000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error changing password: ", error);
      }
    }
  };

  // Effect to handle redirect after successful password reset
  useEffect(() => {
    if (redirect) {
      window.location.href = "/login";
    }
  }, [redirect]);

  // Function to toggle showing/hiding the new password
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  // Function to toggle showing/hiding the confirm password
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      {/* Display notification (success message) */}
      {notification && (
        <div className={notifStyles.notificationContainer}>
          <div className={notifStyles.notificationBox}>
            <div
              className={`${notifStyles.notification} ${
                notification.fadeOut ? notifStyles.fadeOut : ""
              }`}
            >
              {notification}
            </div>
          </div>
        </div>
      )}

      <div className={styles.loginForm}>
        <div className={styles.formName}>Reset Password</div>
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
          <div className={styles.passwordContainer}>
            {/* Input field for the new password */}
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            {/* Button to toggle showing/hiding the new password */}
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={toggleShowNewPassword}
            >
              {showNewPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
            </button>
          </div>
          <div className={styles.passwordContainer}>
            {/* Input field for confirming the new password */}
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            {/* Button to toggle showing/hiding the confirm password */}
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
            </button>
          </div>
          <div>
            {/* Submit button for password reset */}
            <button type="submit" className={styles.btn}>
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
