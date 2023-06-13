import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";

import RegisterPage from "./pages/user/RegisterPage";
import LoginPage from "./pages/user/LoginPage";
import DashboardPage from "./pages/content/Dashboard_Page";
import "./components/themes/themes.css";
import { useNavigate } from "react-router-dom";
import PrivateRoute from "./components/authentication/PrivateRoute";

function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token); // Returns either true or false
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

          <Route path="/register" element={<RegisterPage />} />

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
