import React, { useEffect, useState } from "react";
import axios from "axios";
import notifStyles from "../css/Notifications.module.css";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import RegisterPage from "./RegisterPage";
import ChangePasswordForm from "./ChangePasswordForm";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [showRegisterationForm, setShowRegisterationForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const token = Cookies.get("token");
    const admin = Cookies.get("admin");

    if (!token || admin !== "true") {
      navigate("/login");
    }
  };
  useEffect(() => {
    const fetchDataAndCheckAuthentication = async () => {
      await checkAuthentication();
      fetchData();
    };

    fetchDataAndCheckAuthentication();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/users");
      const data = response.data;

      console.log(data);
      setUsersData(data);
    } catch (error) {
      console.error("Error fetching users data: ", error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowRegisterationForm(true);
  };

  const handleCloseRegistrationForm = () => {
    setShowRegisterationForm(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowRegisterationForm(true);
  };
  const handleEditComplete = async ({ value, columnId, rowId }) => {
    const updatedUser = { ...usersData[rowId], [columnId]: value };
    try {
      await axios.post(
        `http://localhost:5000/users/users/${updatedUser._id}`,
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

  const handleDeleteUser = async (user) => {
    try {
      await axios.delete(`http://localhost:5000/users/users/${user._id}`);
      setNotification("User deleted successfully.");
      fetchData(); // Fetch updated data after deletion
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setShowChangePasswordForm(true);
  };

  const handleChangePasswordCancel = () => {
    setShowChangePasswordForm(false);
  };

  const handleChangePasswordComplete = async (
    user,
    oldPassword,
    newPassword
  ) => {
    try {
      await axios.post(
        `http://localhost:5000/users/users/${user._id}/change-password`,
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
      setNotification("Password changed successfully.");
      setSelectedUser(null);
    } catch (error) {
      console.error("Error changing password: ", error);
    }
  };

  const customersGrid = [
    { name: "username", header: "Username", defaultFlex: 0.6 },
    {
      name: "firstname",
      header: "First Name",
      defaultFlex: 0.6,
      editable: true,
    },
    { name: "lastname", header: "Last Name", defaultFlex: 0.6 },
    { name: "email", header: "Email", defaultFlex: 1 },
    {
      name: "admin",
      header: "Admin",
      defaultFlex: 0.3,
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
      name: "actions",
      header: "Actions",
      defaultFlex: 1,
      render: ({ data }) => (
        <div>
          <button onClick={() => handleEditUser(data)}>Edit</button>
          <button onClick={() => handleChangePassword(data)}>
            Change Password
          </button>
          <button onClick={() => handleDeleteUser(data)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <h2>Users</h2>

      <button onClick={handleAddUser}>Add a New User</button>

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
              <h3>Change Password</h3>
              <ChangePasswordForm
                user={selectedUser}
                onCancel={handleChangePasswordCancel}
                onChangePassword={handleChangePasswordComplete}
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
            <ReactDataGrid
              key={usersData.length}
              id="gridcomp"
              dataSource={usersData}
              columns={customersGrid.map((column) => ({
                ...column,
                setUserData: setUsersData,
              }))}
              style={{ height: 800 }} // Set the height or adjust it according to your needs
              editable
              onEditComplete={handleEditComplete}
              pagination="true"
              defaultPageSize={10} // Set the desired page size
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Users;
