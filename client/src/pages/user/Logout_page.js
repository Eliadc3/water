import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Register_Page.module.css";
import axios from "axios";

const Logout_Page = () => {
  //const history = useHistory();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [authenticated, setAuthenticated] = useState(false);

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
      const res = await axios.get("http://localhost:5000/users/logout");
      if (res.status === 200) {
        alert("Logout successful.");
        console.log("usernameEmail: ", usernameOrEmail, "Logout");

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
      <h2>Logout</h2>
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
          logout
        </button>
      </form>
    </div>
  );
};

export default Logout_Page;
