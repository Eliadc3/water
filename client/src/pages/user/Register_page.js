import React, { useState } from "react";
import styles from "./Register_Page.module.css";
import axios from "axios";

const Register_Page = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "username") {
      setUsername(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
  };

  const handleAdminChange = (event) => {
    setIsAdmin(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/users/register",
        {
          username,
          email,
          password,
          isAdmin,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        alert("User created successfully.");
        console.log("username: ", username);
        console.log("email: ", email);
        console.log("password: ", password);
        console.log("isAdmin: ", isAdmin);
      }
    } catch (err) {
      if (err.res && err.res.data && err.res.message) {
        alert(err.res.data.message);
      } else {
        alert("An error occured. please try again.");
      }

      console.error(err);
    }
  };
  return (
    <div className={styles.loginForm}>
      <h2>Create User</h2>
      <form className="form-body" onSubmit={handleSubmit}>
        <div className="username">
          <input
            type="text"
            title="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
          />
        </div>
        <div className="email">
          <input
            type="text"
            title="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
          />
        </div>
        <div className="password">
          <input
            type="password"
            title="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <div className="isAdmin">
          <label htmlFor="isAdmin">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={handleAdminChange}
            />
            Register as Admin
          </label>
        </div>
        <button type="submit" className={styles.btn}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register_Page;
