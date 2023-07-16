import Cookies from "js-cookie";
import React from "react";

const Logout = () => {
  const handleLogout = () => {
    // Remove token from Cookies
    Cookies.remove("token");

    // Clear user-related data if necessary
    Cookies.remove("user");

    // Remove role(admin) from Cookies
    Cookies.remove("admin");

    // Remove first name from localStorage
    Cookies.remove("firstname");

    // Redirect the user to the login page
    window.location.href = "/login";
  };

  return <span onClick={handleLogout}>Logout</span>;
};

export default Logout;
