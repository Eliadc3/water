// import React, { useState } from "react";
// import styles from "./UserForm.module.css";
// import "@inovua/reactdatagrid-community/index.css";

// const ChangePasswordForm = ({ user, onCancel, onChangePassword }) => {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Perform the password change logic
//       onChangePassword(user, newPassword);
//     } catch (error) {
//       console.error("Error occurred: ", error);
//     }
//     console.log("type: ", oldPassword);
//     console.log("old: ", user.password);

//     if (newPassword !== confirmPassword) {
//       setErrors([{ message: "Password do not match" }]);
//       return;
//     }
//     onChangePassword(user, oldPassword, newPassword);
//   };
//   const handleCloseForm = () => {
//     onCancel();
//   };
//   return (
//     <div className={styles.loginForm}>
//       <div className={styles.formName}>Change Password</div>
//       <form className="form-body" onSubmit={handleSubmit}>
//         {errors.length > 0 && (
//           <div className={styles.errorContainer}>
//             <div className={styles.errorTitle}>
//               <h3>ERRORS</h3>
//             </div>
//             <ul>
//               {errors.map((error, index) => (
//                 <li key={index}>{error.message}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <div className="oldPassword">
//           <input
//             type="password"
//             title="oldPassword"
//             id="oldPassword"
//             placeholder="Old Password"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             title="newPassword"
//             id="newPassword"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             title="confirmPassword"
//             id="confirmPassword"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <button type="submit" className={styles.btn}>
//             Change
//           </button>
//           <button
//             type="button"
//             className={styles.btn}
//             onClick={handleCloseForm}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default ChangePasswordForm;
