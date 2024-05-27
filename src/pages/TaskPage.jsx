import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';

const TaskPage = () => {
    const [task, setTask] = useState({});
    const [project, setProject] = useState({});
    const { state } = useLocation();
    const location = useLocation();
    const [TaskError, setTaskError] = useState("");
    const [TaskSucc, setTaskSucc] = useState("");
    const { projectId, projectName, taskId } = location.state;

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const updateTask = async () => {
        setTaskError("");
        if (task.name === "") {
            setTaskError("Task name cannot be empty");
            return;
        }
        if (task.responsible === "") {
            setTaskError("Responsible user cannot be empty");
            return;
        }
        try {
            await updateDoc(doc(db, 'tasks', taskId), task);
            setTaskSucc("Updated successfully.");
        } catch (error) {
            setTaskError(error.message);
        }
    };

    const redirectBack = async () => {
        navigate(`/projects/${projectId}`, {
            state: {
                projectId: projectId
            }
        });
    };

    const deleteTask = async () => {
        await deleteDoc(doc(db, 'tasks', taskId));
        redirectBack();
    };

    const markAsDone = async (isDoneState) => {
        await updateDoc(doc(db, 'tasks', taskId), {
            isDone: !isDoneState,
            status: "Closed"
        });
        getTaskData();
    };

    const getTaskData = async () => {
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
            setTask(taskSnap.data());
        } else {
            console.log("No such Task!");
        }
    };

    useEffect(() => {
        const getProjectData = async () => {
            const projectRef = doc(db, "projects", projectId);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
                setProject(projectSnap.data());
            } else {
                console.log("No such Project!");
            }
        };
        getTaskData();
        getProjectData();

        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);
            } catch (error) {
                console.error('Error fetching users: ', error);
            }
        };

        fetchUsers();
    }, [projectId, taskId]);

    return (
        <div className="p-6 bg-blue-950 rounded-xl border-4 border-blue-800 text-white">
            <h1 className="text-3xl font-bold mb-4">{projectName}</h1>
            <div className="space-y-4">
                {!task.isDone ? (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="taskName" className="block text-sm font-medium">Title:</label>
                            <input
                                type="text"
                                id="taskName"
                                className="w-full p-2 rounded text-black border border-blue-600"
                                value={task.name || ''}
                                onChange={(e) => setTask({ ...task, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium">Description:</label>
                            <textarea
                                id="description"
                                className="w-full p-2 rounded text-black  border border-blue-600"
                                value={task.description || ''}
                                onChange={(e) => setTask({ ...task, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="sResp" className="block text-sm font-medium">Responsible user:</label>
                            <select
                                name="sResp"
                                id="sResp"
                                className="w-full p-2 rounded text-black  border border-blue-600"
                                value={task.responsible || ''}
                                onChange={(e) => setTask({ ...task, responsible: e.target.value })}
                            >
                                <option value="" disabled>Select a user</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.email}>
                                        {user.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="selectedStatus" className="block text-sm font-medium">Status:</label>
                            <select
                                name="selectedStatus"
                                id="selectedStatus"
                                className="w-full p-2 rounded text-black  border border-blue-600"
                                value={task.status || ''}
                                onChange={(e) => setTask({ ...task, status: e.target.value })}
                            >
                                <option value="Open">Open</option>
                                <option value="In progress">In progress</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium">Deadline:</label>
                            <input
                                type="date"
                                id="deadline"
                                className="w-full p-2 rounded text-black  border border-blue-600"
                                value={task.deadline || ''}
                                onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                            />
                        </div>
                        <div className="space-x-2">
                            <button
                                className="bg-blue-600 p-2 rounded hover:bg-blue-700"
                                onClick={updateTask}
                            >
                                Save
                            </button>
                            <button
                                className="bg-red-600 p-2 rounded hover:bg-red-700"
                                onClick={deleteTask}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-green-600 p-2 rounded hover:bg-green-700"
                                onClick={() => markAsDone(task.isDone)}
                            >
                                Finish task
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-xl font-bold">{task.name}</p>
                        <p>{task.description}</p>
                        <p>Responsible: {task.responsible}</p>
                        <p>Status: {task.status}</p>
                        <button
                            className="bg-yellow-600 p-2 rounded hover:bg-yellow-700"
                            onClick={() => markAsDone(task.isDone)}
                        >
                            Unfinish task
                        </button>
                    </div>
                )}
                <Link
                    to={`/projects/${projectId}`}
                    state={{ projectId: projectId }}
                    className="block mt-4 bg-gray-600 p-2 rounded text-center hover:bg-gray-700"
                >
                    Back
                </Link>
                {TaskError && <div className="text-red-500 mt-2">{TaskError}</div>}
                {TaskSucc && <div className="text-green-500 mt-2">{TaskSucc}</div>}
            </div>
        </div>
    );
};

export default TaskPage;
