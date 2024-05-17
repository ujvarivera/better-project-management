import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
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
    const { projectId, projectName, taskId } = location.state;

    const taskRef = doc(db, "tasks", state.taskId);

    //const tasksRef = collection(db, 'tasks');
    const navigate = useNavigate();

    const updateTask = async() => {
        await updateDoc(doc(db, 'tasks', taskId), task)

        redirectBack();
        
    }

    const redirectBack = async() =>{
        navigate(`/projects/${projectId}`, {
            state: {
              projectId: projectId
            }
          });
    }

    const deleteTask = async() => {
        await deleteDoc(doc(db, 'tasks', taskId))

        redirectBack();
    }

    const markasDone = async(isdonestate) => {
        await updateDoc(doc(db, 'tasks', taskId), {
            isDone: !isdonestate
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

        
    }, [])


    return (
        <div>
            <h1>{projectName}</h1>
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

                        <button onClick={updateTask}>Save</button>
                        <button onClick={() => deleteTask()}>Delete</button>
                        <button onClick={() => markasDone(task.isDone)}> {task.isDone? "Mark as undone": "Mark as done"}</button>
                        <Link to={`/projects/${projectId}` }state={{ projectId: projectId }}>Discard</Link>
                    </div>

        </div>
    )
}

export default TaskPage