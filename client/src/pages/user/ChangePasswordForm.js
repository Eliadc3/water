import React, { useState } from "react";
import axios from "axios";
import styles from "../css/UserForm.module.css";
import notifStyles from "../css/Notifications.module.css";
import "@inovua/reactdatagrid-community/index.css";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

const ChangePasswordForm = ({
  user,
  onCancel,
  onChangePassword,
  setNotification,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [notification, setNotification] = useState(null);
  const [badNotification, setBadNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrors([{ message: "Password do not match" }]);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/users/change-password/${user._id}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setErrors([]);
      setNotification("Password changed successfully.");
      handleCloseForm();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error changing password: ", error);
      }
    }
  };

  const handleCloseForm = () => {
    onCancel();
  };

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
          <div className={styles.passwordContainer}>
            <div className="oldPassword">
              <input
                type={showOldPassword ? "text" : "password"}
                title="Old Password"
                id="oldPassword"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowOldPassword}
              >
                {showOldPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
          <div className={styles.passwordContainer}>
            <div className="newPassword">
              <input
                type={showNewPassword ? "text" : "password"}
                title="New Password"
                id="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                // required
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowNewPassword}
              >
                {showNewPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
          <div className={styles.passwordContainer}>
            <div className="confirmPassword">
              <input
                type={showConfirmPassword ? "text" : "password"}
                title="Confirm Password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowConfirmPassword}
              >
                {showConfirmPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
          <div>
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
