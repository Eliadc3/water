import React, { useEffect, useState, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import { ThemeContext } from "./components/themes/ThemeContext";
import "./components/themes/themes.css";

import "./App.css";
import MainLayout from "./layouts/MainLayout";
import RegisterPage from "./pages/user/RegisterPage";
import LoginPage from "./pages/user/LoginPage";
import DashboardPage from "./pages/content/Dashboard_Page";
import UsersPage from "./pages/user/UsersPage";
import BaselineDataPage from "./pages/content/baselineDataPage";
import AppHeader from "./layouts/AppHeader";

function App() {
  const { theme } = useContext(ThemeContext);

  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuthentication = () => {
    const token = Cookies.get("token");
    const setupTime = Cookies.get("setupTime");
    const hours = 1; // to clear the cookie after 5 minutes
    // const minutes = 2; // to clear the cookie after 2 minutes

    if (token) {
      const currentTime = new Date().getTime();
      if (currentTime - setupTime > hours * 60 * 60 * 1000) {
        //if (currentTime - setupTime > minutes * 60 * 1000) {
        // Token expired, clear cookies and set authenticated to false

        Cookies.remove("token");
        Cookies.remove("admin");
        Cookies.remove("setupTime");
        setAuthenticated(false);
        setIsAdmin(false);
      } else {
        setAuthenticated(true);
        const admin = Cookies.get("admin");
        setIsAdmin(admin === "true");
      }
    } else {
      setAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);
  return (
    <div className="App">
      <div className={`${theme}-theme`}>
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
                <DashboardPage
                  authenticated={authenticated}
                  isAdmin={isAdmin}
                />
              }
            />
          </Routes>
        </MainLayout>
      </div>
    </div>
  );
}

export default App;
