import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Chat } from "./pages/Chat";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import Navbar from './components/Navbar';

function App() {
    return (
        <div className="bg-blue-50 min-h-screen flex flex-col">
            <BrowserRouter>
                <Navbar />
                <div className="flex-1 flex overflow-hidden">
                    <div className="p-10 mt-4 pt-16 h-full w-full overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/chats" element={<Chat />} />
                            <Route exact path="/projects/:projectId" element={<ProjectPage />} />
                            <Route exact path="/projects/:projectId/tasks/:taskId" element={<TaskPage />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
