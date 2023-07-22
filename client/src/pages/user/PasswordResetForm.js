import React, { useState } from "react";
import axios from "axios";
import styles from "../css/UserForm.module.css";
import notifStyles from "../css/Notifications.module.css";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/users/request-password-reset",
        { email },
        {
          headers: { "Content-Type": "application/json" },
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
            <button type="submit" className={styles.btn}>
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
