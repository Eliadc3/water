import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Register_Page.module.css";
import axios from "axios";

const Logout_Page = () => {
  //const history = useHistory();
  const [usernameEmail, setUsernameEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [authenticated, setAuthenticated] = useState(false);

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "username-email") {
      setUsernameEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get("http://localhost:5000/users/logout");
      if (res.status === 200) {
        alert("Logout successful.");
        console.log("usernameEmail: ", usernameEmail, "Logout");

        // setAuthenticated(true);
      }
      // Redirect to the dashboard
      //history.push("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2>Login</h2>
      <form className="form-body" onSubmit={handleSubmit}>
        <div className="username-email">
          <input
            type="text"
            id="username-email"
            placeholder="Username or Email"
            value={usernameEmail}
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
          logout
        </button>
      </form>
    </div>
  );
};

export default Logout_Page;
