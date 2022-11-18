import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import "./App.css";
// export const API_URL = "http://localhost:8000";
export const API_URL = "https://chat-app-api-kaw0.onrender.com";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" exact element={<Login />} />
    </Routes>
  );
}

export default App;
