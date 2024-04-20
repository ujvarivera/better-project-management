import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Chat } from "./pages/Chat";
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chats" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
