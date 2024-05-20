import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import CreateTask from '../components/CreateTask';
import { Link, useNavigate } from 'react-router-dom';

const TaskPage = () => {
    const [task, setTask] = useState({})
    const [project, setProject] = useState({})
    const { state } = useLocation();
    const location = useLocation();
    const [TaskError, setTaskError] = useState("");
    const [TaskSucc, setTaskSucc] = useState("");
    const { projectId, projectName, taskId } = location.state;

    const [users, setUsers] = useState([]);

    const taskRef = doc(db, "tasks", state.taskId);

    //const tasksRef = collection(db, 'tasks');
    const navigate = useNavigate();

    const updateTask = async () => {
        if (task.name === "") {
            setTaskError("Task name cannot be empty")
            return;
        }
        if (task.responsible === "") {
            setTaskError("Responsible user cannot be empty")
            return;
        }
        try {
            await updateDoc(doc(db, 'tasks', taskId), task)
            setTaskSucc("Updated successfully.")
        } catch (error) {
            setTaskErros(error)
        }

        //  redirectBack();

    }

    const redirectBack = async () => {
        navigate(`/projects/${projectId}`, {
            state: {
                projectId: projectId
            }
        });
    }

    const deleteTask = async () => {
        await deleteDoc(doc(db, 'tasks', taskId))

        redirectBack();
    }

    const markasDone = async (isdonestate) => {
        await updateDoc(doc(db, 'tasks', taskId), {
            isDone: !isdonestate,
            status: "Closed"
        })

        getTaskData();

    }

    const getTaskData = async () => {
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
            setTask(taskSnap.data());
        } else {
            // projectSnap.data() will be undefined in this case
            console.log("No such Project!");
        }

    }

    useEffect(() => {

        const getProjectData = async () => {
            const projectRef = doc(db, "projects", projectId);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
                setProject(projectSnap.data());
            } else {
                // projectSnap.data() will be undefined in this case
                console.log("No such Project!");
            }

        }
        getTaskData()
        getProjectData()

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


    }, [])


    return (
        <div>
            <h1>{projectName}</h1>
            <div>


                {!task.isDone ?
                    <div>

                        <input
                            value={task.name}
                            id="taskName"
                            onChange={(e) => setTask({ ...task, name: e.target.value })}
                        />
                        <input
                            value={task.description}
                            id="description"
                            onChange={(e) => setTask({ ...task, description: e.target.value })}
                        />

                        <select name="sResp" id="sResp" defaultValue={task.responsible}
                            onChange={(e) => setTask({ ...task, responsible: e.target.value })}>
                            <option value="" disabled>Select a user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.email}>
                                    {user.email}
                                </option>
                            ))}
                        </select>
                        <select name="selectedStatus" id="selectedStatus" value={task.status}
                            onChange={(e) => setTask({ ...task, status: e.target.value })}>
                            <option value="Open">Open</option>
                            <option value="In progress">In progress</option>
                            <option value="Closed">Closed</option>
                        </select>

                        <button onClick={updateTask}>Save</button>
                        <button onClick={() => deleteTask()}>Delete</button>
                        <button onClick={() => markasDone(task.isDone)}> Finish task</button>
                    </div>
                    :
                    <div>
                        <p>{task.name}</p>
                        <p>{task.description}</p>
                        <p>Responsible: {task.responsible}</p>
                        <p>Status: {task.status}</p>
                        <button onClick={() => markasDone(task.isDone)}> Unfinish task</button>
                    </div>
                }

                <Link to={`/projects/${projectId}`} state={{ projectId: projectId }}>Back</Link>
            </div>

            {
                TaskError &&
                <div className='error-message'>{TaskError}</div>
            }
            {
                TaskSucc &&
                <div className='success-message'>{TaskSucc}</div>
            }

        </div>
    )
}

export default TaskPage