import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const CreateTask = ({ projectId }) => {
    const { state } = useLocation();
    const [TaskError, setTaskError] = useState("");
    const [TaskSucc, setTaskSucc] = useState("");
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        createdAt: new Date(),
        projectId: state.projectId,
        isDone: false,
        responsible: '',
        status: 'Open'
    });

    const [users, setUsers] = useState([]);

    const createNewTask = async () => {
        setTaskError("")
        if (newTask.name === "") {
            setTaskError("Task name cannot be empty")
            return;
        }
        if (newTask.responsible === "") {
            setTaskError("Responsible user cannot be empty")
            return;
        }
        try {
            await addDoc(collection(db, 'tasks'), newTask);
            setTaskSucc("New task added successfully.");

        } catch (error) {
            setTaskErros(error)
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
    }, []);

    return (
        <div>
            <h2>Create New Task</h2>
            <div>
                <label htmlFor="taskName">Name:</label>
                <input
                    type="text"
                    id="taskName"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
            </div>
            <div>
                <label htmlFor="taskDescription">Description:</label>
                <textarea
                    id="taskDescription"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <br />
                <label htmlFor="sResp">Responsible user:</label>
                <select name="sResp" id="sResp" defaultValue=""
                    onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}>
                    <option value="" disabled>Select a user</option>
                    {users.map(user => (
                        <option key={user.id} value={user.email}>
                            {user.email}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={createNewTask}>Create Task</button>

            {
                TaskError &&
                <div className='error-message'>{TaskError}</div>
            }
            {
                TaskSucc &&
                <div className='success-message'>{TaskSucc}</div>
            }
        </div>
    );
};

export default CreateTask;
