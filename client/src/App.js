import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";

import RegisterPage from "./pages/user/RegisterPage";
import LoginPage from "./pages/user/LoginPage";
import DashboardPage from "./pages/content/Dashboard_Page";
import "./components/themes/themes.css";
import { useNavigate } from "react-router-dom";
import UsersPage from "./pages/user/UsersPage";

function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token); // Returns either true or false
    const admin = localStorage.getItem("admin");
    setIsAdmin(admin === "true");
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) navigate("/dashboard");
  }, [authenticated]);

  return (
    <div className="App">
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
            path="/dashboard"
            element={<DashboardPage authenticated={authenticated} />}
          />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
