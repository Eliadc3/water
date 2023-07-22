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

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const token = Cookies.get("token");
    const setupTime = Cookies.get("setupTime");
    const hours = 1; // to clear the cookie after 5 minutes

    if (token) {
      const currentTime = new Date().getTime();
      if (currentTime - setupTime > hours * 60 * 60 * 1000) {
        // When Token expired, clear cookies and set authenticated to false
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

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className="App">
      <AppHeader isAdmin={isAdmin} authenticated={authenticated} />
      <MainLayout>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage checkAuthentication={checkAuthentication} />}
          />
          <Route
            path="/register"
            element={
              <RegisterPage authenticated={authenticated} isAdmin={isAdmin} />
            }
          />

          <Route
            path="/users"
            element={
              <UsersPage authenticated={authenticated} isAdmin={isAdmin} />
            }
          />
          <Route
            path="/baseline"
            element={
              <BaselineDataPage
                authenticated={authenticated}
                isAdmin={isAdmin}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage authenticated={authenticated} isAdmin={isAdmin} />
            }
          />
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
