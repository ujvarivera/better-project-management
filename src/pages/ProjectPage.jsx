import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';

const ProjectPage = () => {
    const [project, setProject] = useState({})
    const [editMode, setEditMode] = useState(false)
    const { state } = useLocation();

    const updateProject = async() => {
        await updateDoc(doc(db, 'projects', state.projectId), project)

        setEditMode(false)
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
            </div>
        </div>
    )
}

export default ProjectPage