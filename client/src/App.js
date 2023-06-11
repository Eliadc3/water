import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";

import RegisterPage from "./pages/user/RegisterPage";
import LoginPage from "./pages/user/LoginPage";
import DashboardPage from "./pages/content/Dashboard_Page";
import "./components/themes/themes.css";

function App() {
  return (
    <div className="App">
      <MainLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
