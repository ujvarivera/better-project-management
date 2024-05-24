import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreateTask = () => {
    const { state } = useLocation();
    const [TaskError, setTaskError] = useState("");
    const [TaskSucc, setTaskSucc] = useState("");
    const [projectDate, setProjectDate] = useState("");
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        createdAt: new Date(),
        projectId: state.projectId,
        isDone: false,
        responsible: '',
        status: 'Open',
        deadline: null
    });

    const [users, setUsers] = useState([]);

    const createNewTask = async () => {
        setTaskError("");
        if (newTask.name === "") {
            setTaskError("Task name cannot be empty");
            return;
        }
        if (newTask.responsible === "") {
            setTaskError("Responsible user cannot be empty");
            return;
        }
        if (newTask.deadline === null) {
            setTaskError("Deadline was not given");
            return;
        }
        if (newTask.deadline > projectDate) {
            setTaskError("Deadline has to be within the project's deadline");
            return;
        }
        try {
            await addDoc(collection(db, 'tasks'), newTask);
            setTaskSucc("New task added successfully.");

            setNewTask({
                name: '',
                description: '',
                createdAt: new Date(),
                projectId: state.projectId,
                isDone: false,
                responsible: '',
                status: 'Open',
                deadline: null
            });

        } catch (error) {
            setTaskError(error.message);
        }
    };

    useEffect(() => {
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

        const getProjectDate = async () => {
            const projectRef = doc(db, "projects", state.projectId);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
                setProjectDate(projectSnap.data().deadline);
            } else {
                console.log("No such Project!");
            }
        };

        getProjectDate();
    }, [state.projectId]);

    return (
        <div className="p-6 bg-purple-600 rounded-xl border-4 border-blue-800 text-white mt-6">
            <h2 className="text-2xl font-bold mb-4">Add New Task for this Project</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="taskName" className="block text-sm font-medium">Name:</label>
                    <input
                        type="text"
                        id="taskName"
                        className="w-full text-black p-2 rounded bg-white border border-blue-600"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="taskDescription" className="block text-sm font-medium">Description:</label>
                    <textarea
                        id="taskDescription"
                        className="text-black bg-white w-full p-2 rounded border border-blue-600"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="sResp" className="block text-sm font-medium">Responsible user:</label>
                    <select
                        name="sResp"
                        id="sResp"
                        className="text-black bg-white  w-full p-2 rounded border border-blue-600"
                        defaultValue=""
                        onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
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
                    <label htmlFor="deadline" className="block text-sm font-medium">Deadline:</label>
                    <input
                        type="date"
                        id="deadline"
                        className="w-full p-2 rounded text-black bg-white border border-blue-600"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                </div>
                <button
                    className="bg-blue-600 p-2 rounded hover:bg-blue-700"
                    onClick={createNewTask}
                >
                    Create Task
                </button>
                {TaskError && <div className="text-red-500 mt-2">{TaskError}</div>}
                {TaskSucc && <div className="text-green-500 mt-2">{TaskSucc}</div>}
            </div>
        </div>
    );
};

export default CreateTask;
