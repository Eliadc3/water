import Cookies from "js-cookie";
import React from "react";

const Logout = () => {
  const handleLogout = () => {
    // Remove token from localStorage
    Cookies.remove("token");

    // Clear user-related data if necessary
    Cookies.remove("user");

    // Remove role(admin) from localStorage
    Cookies.remove("admin");

    // Redirect the user to the login page
    window.location.href = "/login";
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
