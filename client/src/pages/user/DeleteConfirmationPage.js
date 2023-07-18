import React from "react";
import styles from "../css/UserForm.module.css";

const DeleteConfirmationForm = ({ user, onCancel, onConfirm }) => {
  return (
    <div className={styles.loginForm}>
      <div className={styles.formName}>Delete User</div>
      <div className={styles.deleteFormBody}>
        <div className={styles.deleteFormText}>
          Are you sure you want to delete the user {user.username}?
        </div>
        <div className={styles.buttons}></div>
        <button className={styles.btn} onClick={() => onConfirm(true)}>
          Yes
        </button>
        <button className={styles.btn} onClick={() => onConfirm(false)}>
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationForm;
