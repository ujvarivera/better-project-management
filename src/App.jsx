import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register"
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  return (
    <div>
      <h1>Better Project Management</h1>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
