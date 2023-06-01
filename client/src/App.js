import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Redirect,
} from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Register_page from "./pages/user/Register_page";
import Upload_file_Page from "./pages/content/Upload_file_Page.js";
//import Charts from "./components/charts";
import Login_Page from "./pages/user/Login_page";
import Logout_Page from "./pages/user/Logout_page";

import Dashboard_Page from "./pages/content/Dashboard_Page";

function App() {
  return (
    <div className="App">
      <MainLayout>
        <Routes>
          <Route path="/login" element={<Login_Page />}>
            {/* {isLoggedIn() ? <Redirect to="/dashboard" /> : <Login_Page />} */}
          </Route>
          <Route path="/logout" element={<Logout_Page />} />

          <Route path="/register" element={<Register_page />} />
          <Route path="/uploadfile" element={<Upload_file_Page />} />
          <Route path="/dashboard" element={<Dashboard_Page />}>
            {/* {isLoggedIn() ? <Dashboard_Page /> : <Redirect to="/login" />} */}
          </Route>
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
