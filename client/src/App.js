import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Register_page from "./pages/user/Register_page";

function App() {
  return (
    <div className="App">
      <MainLayout>
        <Routes>
          <Route path="/register" element={<Register_page />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
