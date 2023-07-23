import React from "react";
import styles from "../css/UserForm.module.css";

// The DeleteConfirmationForm component is a component that displays a confirmation message for
// deleting a user and provides buttons to confirm or cancel the deletion.
const DeleteConfirmationForm = ({ user, onConfirm }) => {
  return (
    <div className={styles.loginForm}>
      {/* Display the form name */}
      <div className={styles.formName}>Delete User</div>
      <div className={styles.deleteFormBody}>
        {/* Display the confirmation message with the username */}
        <div className={styles.deleteFormText}>
          Are you sure you want to delete the user: {user.username}?
        </div>
        {/* Buttons for confirming or canceling the delete action */}
        <div className={styles.buttons}>
          {/* "Yes" button to confirm the deletion */}
          <button className={styles.btn} onClick={() => onConfirm(true)}>
            Yes
          </button>
          {/* "No" button to cancel the deletion */}
          <button className={styles.btn} onClick={() => onConfirm(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationForm;
