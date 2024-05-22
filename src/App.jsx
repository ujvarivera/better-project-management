import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Chat } from "./pages/Chat";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="overflow-hidden bg-blue-50 h-full">
      <BrowserRouter>
        <Navbar />
          <div className="p-3 pt-0 mr-20 ml-20">
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/chats" element={<Chat />} />
                  <Route exact path="/projects/:projectId" element={<ProjectPage />} />
                  <Route exact path="/projects/:projectId/tasks/:taskId" element={<TaskPage />} />
              </Routes>
          </div>
      </BrowserRouter>
    </div>

  )
}

export default App
