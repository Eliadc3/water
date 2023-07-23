import React, { useState } from "react";
import axios from "axios";
import styles from "../css/UserForm.module.css";
import notifStyles from "../css/Notifications.module.css";

// The `PasswordResetRequest` component is a form that allows users to request a password reset by
// entering their email.
const PasswordResetRequest = () => {
  // State to manage user's email input
  const [email, setEmail] = useState("");

  // State for displaying notification (success message)
  const [notification, setNotification] = useState(null);

  // State to store errors (if any)
  const [errors, setErrors] = useState([]);

  // Function to handle form submission (password reset request)
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/users/request-password-reset",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setErrors([]);
      if (response.status === 200) {
        setNotification("Password reset link sent to your email.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error sending reset password link: ", error);
      }
    }
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
          {/* Input field for user's email */}
          <div className="email">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            {/* Submit button for requesting password reset */}
            <button type="submit" className={styles.btn}>
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
