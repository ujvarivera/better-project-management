import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import CreateTask from '../components/CreateTask';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

const ProjectPage = () => {
    const [project, setProject] = useState({});
    const [editMode, setEditMode] = useState(false);
    const { state } = useLocation();

    const [tasks, setTasks] = useState([]);
    const tasksRef = collection(db, 'tasks');

    const updateProject = async () => {
        await updateDoc(doc(db, 'projects', state.projectId), project);
        setEditMode(false);
    };

    const deleteTask = async (id) => {
        await deleteDoc(doc(db, 'tasks', id));
    };

    const markAsDone = async (id, isDoneState) => {
        await updateDoc(doc(db, 'tasks', id), {
            isDone: !isDoneState,
            status: "Closed"
        });
    };

    useEffect(() => {
        const getProjectData = async () => {
            const projectRef = doc(db, "projects", state.projectId);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
                setProject(projectSnap.data());
            } else {
                console.log("No such Project!");
            }
        };
        getProjectData();

        const queryTasks = query(
            tasksRef,
            where('projectId', '==', state.projectId),
            orderBy('deadline', 'asc')
        );

        const unsubscribe = onSnapshot(queryTasks, snapshot => {
            let fetchedTasks = [];
            snapshot.forEach(doc => {
                fetchedTasks.push({ ...doc.data(), id: doc.id });
            });
            setTasks(fetchedTasks);
        });

        return () => unsubscribe();
    }, [state.projectId]);

    return (
        <div className="p-6 bg-blue-950 rounded-xl border-4 border-blue-800 text-white">
            <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
            {editMode ? (
                <div className="space-y-4">
                    <Input
                        value={project.name}
                        id="projectName"
                        className="w-full p-2 rounded"
                        onChange={(e) => setProject({ ...project, name: e.target.value })}
                    />
                    <textarea
                        value={project.description}
                        id="description"
                        className="w-full p-2 rounded"
                        onChange={(e) => setProject({ ...project, description: e.target.value })}
                    />
                    <select
                        name="selectedStatus"
                        id="selectedStatus"
                        className="w-full p-2 rounded"
                        value={project.status}
                        onChange={(e) => setProject({ ...project, status: e.target.value })}
                    >
                        <option value="Open">Open</option>
                        <option value="In progress">In progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <Input
                        type="date"
                        id="deadline"
                        className="w-full p-2 rounded"
                        value={project.deadline}
                        onChange={(e) => setProject({ ...project, deadline: e.target.value })}
                    />
                    <select
                        name="selectedPriority"
                        id="selectedPriority"
                        className="w-full p-2 rounded"
                        value={project.priority}
                        onChange={(e) => setProject({ ...project, priority: e.target.value })}
                    >
                        <option value={1}>1 (High)</option>
                        <option value={2}>2 (Middle)</option>
                        <option value={3}>3 (Low)</option>
                    </select>
                    <Button
                        className="bg-blue-600 p-2 rounded hover:bg-blue-700"
                        onClick={updateProject}
                    >
                        Save
                    </Button>
                </div>
            ) : (
                <div className="space-y-1">
                    <p>{project.description}</p>
                    <p>Deadline: {project.deadline}</p>
                    <p>Priority: {project.priority}</p>
                    <p>Status: {project.status}</p>
                    <Button
                        className="bg-blue-600 p-2 rounded hover:bg-blue-700"
                        onClick={() => setEditMode(true)}
                    >
                        Edit Project
                    </Button>
                </div>
            )}
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">List of Tasks:</h2>
                {tasks.length > 0 ? (
                    <ul className="space-y-4">
                        {tasks.map(task => (
                            <li key={task.id} className="bg-purple-600 p-4 rounded-xl">
                                <h3 className="text-xl font-bold">{task.name}</h3>
                                <p>{task.description}</p>
                                <p>Created at: {task.createdAt.toDate().toLocaleString()}</p>
                                <p>Responsible: {task.responsible}</p>
                                <p>Status: {task.status}</p>
                                <p>Deadline: {task.deadline}</p>
                                <div className="mt-2 space-x-2">
                                    {!task.isDone ? (
                                        <>
                                            <Button
                                                className="bg-red-600 p-2 rounded hover:bg-red-700"
                                                onClick={() => deleteTask(task.id)}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                className="bg-green-600 p-2 rounded hover:bg-green-700"
                                                onClick={() => markAsDone(task.id, task.isDone)}
                                            >
                                                Finish task
                                            </Button>
                                            <Link
                                                to={`/projects/${state.projectId}/tasks/${task.id}`}
                                                state={{ projectId: state.projectId, projectName: project.name, taskId: task.id }}
                                                className="bg-blue-600 p-2 rounded hover:bg-blue-700"
                                            >
                                                Update
                                            </Link>
                                        </>
                                    ) : (
                                        <Link
                                            to={`/projects/${state.projectId}/tasks/${task.id}`}
                                            state={{ projectId: state.projectId, projectName: project.name, taskId: task.id }}
                                            className="bg-blue-600 p-2 rounded hover:bg-blue-700"
                                        >
                                            Update
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>No tasks found</div>
                )}
                <CreateTask />
            </div>
        </div>
    );
};

export default ProjectPage;
