import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Register_Page.module.css";
import axios from "axios";

const Login_Page = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
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
      if (res.status === 200) {
        alert("Login successful.");
        console.log("usernameEmail: ", usernameOrEmail);
        console.log("password: ", password);

        //setAuthenticated(true);
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

  return (
    <div className={styles.loginForm}>
      <h2>Login</h2>
      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          <h3>ERRORS</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
      <form className="form-body" onSubmit={handleSubmit}>
        <div className="usernameOrEmail">
          <input
            type="text"
            id="usernameOrEmail"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={handleInputChange}
          />
        </div>
        <div className="password">
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className={styles.btn}>
          submit
        </button>
        <div></div>
      </form>
    </div>
  );
};

export default Login_Page;
