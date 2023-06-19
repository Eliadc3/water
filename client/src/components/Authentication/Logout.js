import React from "react";

const Logout = () => {
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear user-related data if necessary
    localStorage.removeItem("user");

    // Remove role(admin) from localStorage
    localStorage.removeItem("admin");

    // Redirect the user to the login page
    window.location.href = "/login";
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
