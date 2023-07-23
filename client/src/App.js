import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import "./App.css";
import MainLayout from "./layouts/MainLayout";
import RegisterPage from "./pages/user/RegisterPage";
import LoginPage from "./pages/user/LoginPage";
import DashboardPage from "./pages/content/Dashboard_Page";
import UsersPage from "./pages/user/UsersPage";
import BaselineDataPage from "./pages/content/baselineDataPage";
import AppHeader from "./layouts/AppHeader";
import PasswordResetPage from "./pages/user/PasswordResetPage";

// The App component is a React function component that handles authentication and routing for
// different pages in the application.
function App() {
  // State to track user authentication status
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // React Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check authentication status
  const checkAuthentication = () => {
    const token = Cookies.get("token");
    const setupTime = Cookies.get("setupTime");
    const hours = 1; // to clear the cookie after 1 hour

    if (token) {
      const currentTime = new Date().getTime();
      if (currentTime - setupTime > hours * 60 * 60 * 1000) {
        // When Token expired, clear cookies and set authenticated and isAdmin to false
        Cookies.remove("token");
        Cookies.remove("admin");
        Cookies.remove("setupTime");
        setAuthenticated(false);
        setIsAdmin(false);
        navigate("/login"); // Redirect to login page
      } else {
        setAuthenticated(true);
        const admin = Cookies.get("admin");
        setIsAdmin(admin === "true");
        if (location.pathname === "/") {
          navigate("/dashboard"); // Redirect to dashboard page
        }
      }
    } else {
      setAuthenticated(false);
      setIsAdmin(false);
      if (location.pathname === "/") {
        navigate("/login"); // Redirect to login page
      }
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className="App">
      {/* AppHeader component displays the navigation header */}
      <AppHeader isAdmin={isAdmin} authenticated={authenticated} />
      <MainLayout>
        <Routes>
          {/* Route for the login page */}
          <Route
            path="/login"
            element={<LoginPage checkAuthentication={checkAuthentication} />}
          />
          {/* Route for the registration page */}
          <Route
            path="/register"
            element={
              <RegisterPage authenticated={authenticated} isAdmin={isAdmin} />
            }
          />
          {/* Route for the users page */}
          <Route
            path="/users"
            element={
              <UsersPage authenticated={authenticated} isAdmin={isAdmin} />
            }
          />
          {/* Route for the baseline data page */}
          <Route
            path="/baseline"
            element={
              <BaselineDataPage
                authenticated={authenticated}
                isAdmin={isAdmin}
              />
            }
          />
          {/* Route for the dashboard page */}
          <Route
            path="/dashboard"
            element={
              <DashboardPage authenticated={authenticated} isAdmin={isAdmin} />
            }
          />
          {/* Route for the password reset page */}
          <Route
            path="/reset-password/:userId/:token"
            element={<PasswordResetPage />}
          />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
