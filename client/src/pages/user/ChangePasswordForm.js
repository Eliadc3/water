import React, { useState } from "react";
import axios from "axios";
import styles from "../css/UserForm.module.css";
import "@inovua/reactdatagrid-community/index.css";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

// ChangePasswordForm is a functional component to handle password change form
const ChangePasswordForm = ({
  user, // The user object to change the password for
  onCancel, // Function to handle form cancellation
  setNotification, // Function to set a notification message
}) => {
  // State variables to store input values and form errors
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  // State variables to manage password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the new password matches the confirm password
    if (newPassword !== confirmPassword) {
      setErrors([
        {
          message: "Password do not match",
        },
      ]);
      return;
    }

    try {
      // Send a POST request to change the password
      const response = await axios.post(
        `http://localhost:5000/users/change-password/${user._id}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setErrors([]);
      // Set a notification to indicate that the password has been changed successfully
      setNotification("Password changed successfully.");
      handleCloseForm();
    } catch (error) {
      // If there are errors in the response, set the errors in the state
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error changing password: ", error);
      }
    }
  };

  // Function to handle form cancellation
  const handleCloseForm = () => {
    onCancel();
  };

  // Functions to toggle password visibility
  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div>
      <div className={styles.loginForm}>
        <div className={styles.formName}>Change Password</div>
        <form className="form-body" onSubmit={handleSubmit}>
          {/* Display error messages if there are any */}
          {errors.length > 0 && (
            <div className={styles.errorContainer}>
              <div className={styles.errorTitle}>
                <h3>ERRORS</h3>
              </div>
              <ul>
                {/* Map through the errors array and display each error message */}
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Password input field for Old Password */}
          <div className={styles.passwordContainer}>
            <div className="oldPassword">
              <input
                type={showOldPassword ? "text" : "password"}
                title="Old Password"
                id="oldPassword"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                required
              />
              {/* Button to toggle visibility of Old Password */}
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowOldPassword}
              >
                {/* Display the "eye" icon based on password visibility state */}
                {showOldPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
          {/* Password input field for New Password */}
          <div className={styles.passwordContainer}>
            <div className="newPassword">
              <input
                type={showNewPassword ? "text" : "password"}
                title="New Password"
                id="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              {/* Button to toggle visibility of New Password */}
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowNewPassword}
              >
                {/* Display the "eye" icon based on password visibility state */}
                {showNewPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
          {/* Password input field for Confirm Password */}
          <div className={styles.passwordContainer}>
            <div className="confirmPassword">
              <input
                type={showConfirmPassword ? "text" : "password"}
                title="Confirm Password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              {/* Button to toggle visibility of Confirm Password */}
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowConfirmPassword}
              >
                {/* Display the "eye" icon based on password visibility state */}
                {showConfirmPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
          <div>
            {/* Submit and Cancel buttons */}
            <button type="submit" className={styles.btn}>
              Change
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={handleCloseForm}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChangePasswordForm;
