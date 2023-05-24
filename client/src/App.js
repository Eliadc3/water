import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Register_page from "./pages/user/Register_page";
import Upload_file_Page from "./pages/content/Upload_file_Page.js";

function App() {
  return (
    <div className="App">
      <MainLayout>
        <Routes>
          <Route path="/register" element={<Register_page />} />
          <Route path="/uploadfile" element={<Upload_file_Page />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
