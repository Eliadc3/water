import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

import styles from "../css/UserForm.module.css";
import notifStyles from "../css/Notifications.module.css";
import axios from "axios";
import Cookies from "js-cookie";

import PasswordResetForm from "./PasswordResetForm";

const LoginPage = ({ checkAuthentication }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);

  const [badNotification, setBadNotification] = useState(null);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "usernameOrEmail") {
      setUsernameOrEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
  };

  useEffect(() => {
    if (badNotification) {
      const timer = setTimeout(() => {
        setBadNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badNotification]);

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
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        const hours = 1; // Set the expiration time for the cookie
        // Save token as a cookie
        Cookies.set("token", res.data.token, {
          expires: hours / 24,
        });
        Cookies.set("admin", res.data.admin, {
          expires: hours / 24,
        });
        Cookies.set("username", res.data.username, {
          expires: hours / 24,
        });

        checkAuthentication();

        // redirect to uploadfile page
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setErrors([{ message: "Invalid username/email or password." }]);
        setBadNotification("Invalid username/email or password.");
      } else {
        setErrors([{ message: "An error occurred. Please try again." }]);
        setBadNotification("An error occurred. Please try again.");
      }
      console.error(error);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowPasswordResetForm = () => {
    setShowPasswordResetForm(!showPasswordResetForm);
  };

  return (
    <div>
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
        {showPasswordResetForm ? (
          <PasswordResetForm />
        ) : (
          <div
            className={styles.loginForm}
            style={{
              color: "white",
            }}
          >
            <div className={styles.formName}>Login</div>
            <form className="form-body" onSubmit={handleSubmit}>
              {errors.length > 0 && (
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
                  {showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
                </button>
              </div>
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
