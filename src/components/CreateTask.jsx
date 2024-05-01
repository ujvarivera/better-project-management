import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreateTask = ({ projectId }) => {
    const { state } = useLocation();
    const [TaskError, setTaskError] = useState("");
    const [TaskSucc, setTaskSucc] = useState("");
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        createdAt: new Date(),
        projectId: state.projectId
    });

    const createNewTask = async () => {
        setTaskError("")
        if (newTask.name === "") {
            setTaskError("Task name cannot be empty")
            return;
        }
        try {
            await addDoc(collection(db, 'tasks'), newTask);
            setTaskSucc("New task added successfully.");
        
        } catch (error) {
            setTaskErros(error)
        }
    };

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
