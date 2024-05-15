import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import CreateTask from '../components/CreateTask';
import { Link } from 'react-router-dom';

const ProjectPage = () => {
    const [project, setProject] = useState({})
    const [editMode, setEditMode] = useState(false)
    const { state } = useLocation();

    const [tasks, setTasks] = useState([]);
    const tasksRef = collection(db, 'tasks');

    const updateProject = async() => {
        await updateDoc(doc(db, 'projects', state.projectId), project)

        setEditMode(false)
    }

    const deleteTask = async(id) => {
        await deleteDoc(doc(db, 'tasks', id))
    }

    const markasDone = async(id, isdonestate) => {
        await updateDoc(doc(db, 'tasks', id), {
            isDone: !isdonestate
        })
        
    }

    useEffect(() => {
        const getProjectData = async () => {
            const projectRef = doc(db, "projects", state.projectId);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
                setProject(projectSnap.data());
            } else {
                // projectSnap.data() will be undefined in this case
                console.log("No such Project!");
            }

        }
        getProjectData()

        const queryTasks = query(
            tasksRef,
            where('projectId','==',state.projectId),
            orderBy('createdAt', 'asc')
        );
        const unsubscribe = onSnapshot(queryTasks, snapshot => {
            let fetchedTasks = [];
            snapshot.forEach(doc => {
                fetchedTasks.push({ ...doc.data(), id: doc.id });
            });
            setTasks(fetchedTasks);
        });

        return () => unsubscribe();
    }, [])


    return (
        <div>
            <h1>{project.name}</h1>
            {
                editMode ?
                    <div>
                        <input
                            value={project.name}
                            id="projectName"
                            onChange={(e) => setProject({ ...project, name: e.target.value })}
                        />
                        <input
                            value={project.description}
                            id="description"
                            onChange={(e) => setProject({ ...project, description: e.target.value })}
                        />
                        <input type="date" id='deadline' value={project.deadline} onChange={(e) => setProject({ ...project, deadline: e.target.value })} />
                        <select name="selectedPriority" id="selectedPriority" value={project.priority}
                            onChange={(e) => setProject({ ...project, priority: e.target.value })}>
                            <option value={1}>1 (High)</option>
                            <option value={2}>2 (Middle)</option>
                            <option value={3}>3 (Low)</option>
                        </select>

                        <button onClick={updateProject}>Save</button>
                    </div> :
                    <div>
                        <p>{project.description}</p>
                        <p>Deadline: {project.deadline}</p>
                        <p>Priority: {project.priority}</p>
                        <button onClick={() => setEditMode(true)}>Edit Project</button>
                    </div>
            }
            <div>
                <h2>List of Tasks:</h2>

                {tasks.length > 0 ? (
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Created at: {task.createdAt.toDate().toLocaleString()}</p>
                            <button onClick={() => deleteTask(task.id)}>X</button>
                            <button onClick={() => markasDone(task.id, task.isDone)}> {task.isDone? "Mark as undone": "Mark as done"}</button>
                            <Link to={`/projects/${state.projectId}/tasks/${task.id}`} state={{projectId: project.id, projectName: project.name, taskId: task.id}}>Update</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div>No tasks found</div>
            )}
            <CreateTask />
            </div>
        </div>
    )
}

export default ProjectPage