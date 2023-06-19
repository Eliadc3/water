import React, { useRef, useState, useEffect } from "react";
import styles from "./UserForm.module.css";
import axios from "axios";

const RegisterPage = ({
  onSuccess,
  onClose,
  selectedUser,
  setNotification,
}) => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [admin, setAdmin] = useState(false);
  const formRef = useRef(null);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      setUsername(selectedUser.username);
      setFirstname(selectedUser.firstname);
      setLastname(selectedUser.lastname);
      setEmail(selectedUser.email);
      setAdmin(selectedUser.admin);
    }
  }, [selectedUser]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "username") {
      setUsername(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "firstname") {
      setFirstname(value);
    }
    if (id === "lastname") {
      setLastname(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "password2") {
      setPassword2(value);
    }
  };

  const handleAdminChange = (event) => {
    const { checked, id } = event.target;
    if (id === "admin") {
      setAdmin(checked);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let res;
      if (selectedUser) {
        // Update existing user
        res = await axios.post(
          `http://localhost:5000/users/users/${selectedUser._id}`,
          {
            username,
            firstname,
            lastname,
            email,
            admin,
            password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } else {
        // Create new user
        res = await axios.post(
          "http://localhost:5000/users/register",
          {
            username,
            firstname,
            lastname,
            email,
            password,
            password2,
            admin,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      }
      if (res.status === 201) {
        onClose(); //Close the register form
        setNotification("User updated successfully.");
        onSuccess(); // Call the onSuccess prop to trigger data refresh in the parent component
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("An error occurred. Please try again.");
      }

      console.error(err);
    }
  };

  const handleCloseForm = () => {
    onClose(); // Call the onClose prop to close the form in the parent component
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      handleCloseForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.loginForm} ref={formRef}>
      <div className={styles.formName}>
        {selectedUser ? "Edit User" : "Create User"}
      </div>
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
        <div className="firstname">
          <input
            type="text"
            title="firstname"
            id="firstname"
            placeholder="First name"
            value={firstname}
            onChange={handleInputChange}
          />
        </div>
        <div className="lastname">
          <input
            type="text"
            title="lastname"
            id="lastname"
            placeholder="Last name"
            value={lastname}
            onChange={handleInputChange}
          />
        </div>
        {!selectedUser && (
          <div className="password">
            <input
              type="password"
              title="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={handleInputChange}
            />
          </div>
        )}
        {!selectedUser && (
          <div className="password2">
            <input
              type="password"
              title="password2"
              id="password2"
              placeholder="Enter Password Again"
              value={password2}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Current password input */}

        <div className="admin">
          <label htmlFor="admin">
            <input
              type="checkbox"
              id="admin"
              checked={admin}
              onChange={handleAdminChange}
            />
            Create as Admin
          </label>
        </div>
        <button type="submit" className={styles.btn}>
          {selectedUser ? "Save Changes" : "Create User"}
        </button>
        <button type="button" onClick={handleCloseForm} className={styles.btn}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
