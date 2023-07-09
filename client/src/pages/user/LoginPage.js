import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

import styles from "./UserForm.module.css";
import axios from "axios";
import Cookies from "js-cookie";

const LoginPage = ({ checkAuthentication }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

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
        alert("Login successful.");
        console.log("usernameEmail: ", usernameOrEmail);
        console.log("password: ", password);

        const minutes = 2; // Set the expiration time for the cookie
        const setupTime = new Date().getTime(); // Get the current time
        // Save token as a cookie
        Cookies.set("token", res.data.token, {
          expires: minutes / (24 * 60), // Convert minutes to days
        });
        Cookies.set("admin", res.data.admin, {
          expires: minutes / (24 * 60), // Convert minutes to days
        });
        Cookies.set("setupTime", setupTime, {
          expires: minutes / (24 * 60),
        });

        // const hours = 1; // Set the expiration time for the cookie
        // // Save token as a cookie
        // Cookies.set("token", res.data.token, {
        //   expires: hours / 24,
        // });
        // Cookies.set("admin", res.data.admin, {
        //   expires: hours / 24,
        // });
        checkAuthentication();

        // redirect to uploadfile page
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.status) {
        setErrors([{ message: "Invalid username/email or password." }]);
      } else {
        setErrors([{ message: "An error occurred. Please try again." }]);
      }

      console.error(err);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.formName}>Login</div>
      <form className="form-body" onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className={styles.errorContainer}>
            <div className={styles.errorTitle}>
              <h3>ERRORS</h3>
            </div>
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
        <div></div>
      </form>
    </div>
  );
};

export default LoginPage;
