import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../css/UserForm.module.css";
import notifStyles from "../css/Notifications.module.css";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const { userId, token } = useParams(); // Extract userId and token from the URL
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState([]);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = [];

    if (newPassword !== confirmPassword) {
      setErrors([{ message: "Password do not match" }]);
      return;
    }
    try {
      // Send the password reset request to the server
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
  useEffect(() => {
    if (redirect) {
      window.location.href = "/login";
    }
  }, [redirect]);

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
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
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={toggleShowNewPassword}
            >
              {showNewPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
            </button>
          </div>
          <div className={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
            </button>
          </div>
          <div>
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
