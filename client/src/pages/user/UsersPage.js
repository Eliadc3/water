import React, { useEffect, useState } from "react";
import axios from "axios";
import notifStyles from "../css/Notifications.module.css";
import styles from "../css/Dashboard_Page.module.css";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import RegisterPage from "./RegisterPage";
import ChangePasswordForm from "./ChangePasswordForm";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import DeleteConfirmationForm from "./DeleteConfirmationPage";

// The Users component is a component that displays a table of users, allows for adding, editing,
// and deleting users, and provides forms for registering new users and changing user passwords.

const Users = () => {
  // State to store user data fetched from the server
  const [usersData, setUsersData] = useState([]);

  // State to control the display of registration, change password, and delete confirmation forms
  const [showRegisterationForm, setShowRegisterationForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // State to store the selected user for editing or deleting
  const [selectedUser, setSelectedUser] = useState(null);

  // State to show notification messages
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // Function to check authentication status and redirect to login page if not authenticated
  const checkAuthentication = () => {
    const token = Cookies.get("token");
    const admin = Cookies.get("admin");

    if (!token || admin !== "true") {
      navigate("/login");
    }
  };

  // Check authentication status and fetch user data on component mount
  useEffect(() => {
    const fetchDataAndCheckAuthentication = async () => {
      await checkAuthentication();
      fetchData();
    };

    fetchDataAndCheckAuthentication();
  }, []);

  // Set a timer to automatically clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Function to fetch user data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/get-users");
      const data = response.data;

      console.log(data);
      setUsersData(data);
    } catch (error) {
      console.error("Error fetching users data: ", error);
    }
  };

  // Function to add a new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowRegisterationForm(true);
  };

  // Function to close the registration form
  const handleCloseRegistrationForm = () => {
    setShowRegisterationForm(false);
  };

  // Function to handle user edit
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowRegisterationForm(true);
  };

  // Function to handle user edit completion
  const handleEditComplete = async ({ value, columnId, rowId }) => {
    const updatedUser = {
      ...usersData[rowId],
      [columnId]: value,
    };
    try {
      await axios.post(
        `http://localhost:5000/users/update/${updatedUser._id}`,
        updatedUser,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setShowRegisterationForm(false); // Close the form
      setNotification("User updated successfully."); // Show alert message
      fetchData();
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  // Function to handle user delete
  const handleDeleteUser = async (user) => {
    setSelectedUser(user);
    setShowDeleteConfirmation(true);
  };

  // Function to handle user delete confirmation
  const handleConfirmDelete = async (confirm) => {
    if (confirm && selectedUser) {
      try {
        await axios.delete(
          `http://localhost:5000/users/delete/${selectedUser._id}`
        );
        setNotification("User deleted successfully.");
        fetchData(); // Fetch updated data after deletion
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
    setSelectedUser(null);
    setShowDeleteConfirmation(false);
  };

  // Function to handle changing user password
  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setShowChangePasswordForm(true);
  };

  // Function to handle changing user password cancel
  const handleChangePasswordCancel = () => {
    setShowChangePasswordForm(false);
  };

  // Function to handle changing user password completion
  const handleChangePasswordComplete = async (
    user,
    oldPassword,
    newPassword
  ) => {
    try {
      await axios.post(
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
      setShowChangePasswordForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error changing password: ", error);
    }
  };

  // Configuration for the ReactDataGrid columns
  const customersGrid = [
    {
      name: "username",
      header: "Username",
      defaultFlex: 0.6,
    },
    {
      name: "firstname",
      header: "First Name",
      defaultFlex: 0.6,
      editable: true,
    },
    {
      name: "lastname",
      header: "Last Name",
      defaultFlex: 0.6,
    },
    { name: "email", header: "Email", defaultFlex: 1 },
    {
      name: "admin",
      header: "Admin",
      defaultFlex: 0.4,
      render: ({ value }) => (value ? "Yes" : "No"),
      editor: "checkbox",
    },
    {
      name: "createdAt",
      header: "Created At",
      defaultFlex: 0.6,
      render: ({ value }) => {
        const date = new Date(value);
        const formattedDate = `${date.getDate()}/${date.getMonth() +
          1}/${date.getFullYear()}`;
        const formattedTime = `${date.getHours()}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`;
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      name: "updatedAt",
      header: "Updated At",
      defaultFlex: 0.6,
      render: ({ value }) => {
        const date = new Date(value);
        const formattedDate = `${date.getDate()}/${date.getMonth() +
          1}/${date.getFullYear()}`;
        const formattedTime = `${date.getHours()}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`;
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      name: "actions",
      header: "Actions",
      defaultFlex: 1.52,
      render: ({ data }) => (
        <div>
          <button
            className={styles.gridbtn}
            onClick={() => handleEditUser(data)}
          >
            Edit
          </button>
          <button
            className={styles.gridbtn}
            onClick={() => handleChangePassword(data)}
          >
            Change Password
          </button>
          <button
            className={styles.gridbtn}
            onClick={() => handleDeleteUser(data)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div className={styles.pageName}>
        {showChangePasswordForm || showRegisterationForm ? null : (
          <h2>Users</h2>
        )}
      </div>
      {showChangePasswordForm || showRegisterationForm ? null : (
        <button className={styles.btn} onClick={handleAddUser}>
          Add a New User
        </button>
      )}
      <div className={notifStyles.container}>
        {showRegisterationForm ? (
          <div className="modal">
            <div className="modal-content">
              <RegisterPage
                onSuccess={fetchData}
                onClose={handleCloseRegistrationForm}
                selectedUser={selectedUser}
                setNotification={setNotification}
              />
            </div>
          </div>
        ) : showChangePasswordForm ? (
          <div className="modal">
            <div className="modal-content">
              <ChangePasswordForm
                user={selectedUser}
                onCancel={handleChangePasswordCancel}
                onChangePassword={handleChangePasswordComplete}
                setNotification={setNotification}
              />
            </div>
          </div>
        ) : (
          <div>
            {notification && (
              <div className={notifStyles.notificationContainer}>
                <div className={notifStyles.notificationBox}>
                  <div
                    className={`${notifStyles.notification} ${
                      notification.fadeOut ? notifStyles.fadeOut : ""
                    }`}
                  >
                    {notification}
                  </div>
                </div>
              </div>
            )}
            <div>
              <ReactDataGrid
                key={usersData.length}
                id="gridcomp"
                dataSource={usersData}
                columns={customersGrid.map((column) => ({
                  ...column,
                  setUserData: setUsersData,
                }))}
                style={{
                  height: 800,
                  color: "black",
                }} // Set the height or adjust it according to your needs
                editable
                onEditComplete={handleEditComplete}
                pagination="true"
                defaultPageSize={10} // Set the desired page size
              />
            </div>
            {showDeleteConfirmation && selectedUser && (
              <div className="modal">
                <div className="modal-content">
                  <DeleteConfirmationForm
                    user={selectedUser}
                    onConfirm={handleConfirmDelete}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Users;
