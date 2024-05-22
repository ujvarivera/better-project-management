import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
    const [project, setProject] = useState({ name: "", description: "" })
    const [selectedPriority, setSelectedPriority] = useState(1)
    const [deadline, setDeadLine] = useState("")
    const [status, setStatus] = useState("Open")
    const [projectError, setProjectError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, loading, error] = useAuthState(auth);
    const projectsRef = collection(db, "projects");
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setSuccess(false)
        }, 4000)
    }, [success])

    const addProject = async () => {
        setProjectError("")
        if (project.name === "") {
            setProjectError("Project name must be at least 4 characters.")
            return;
        }
        await addDoc(projectsRef, {
            name: project.name,
            description: project.description,
            priority: selectedPriority,
            deadline: deadline,
            status: status,
            createdAt: serverTimestamp(),
        }).then(function () {
            setProject({ name: "", description: "" })
            setSelectedPriority(1)
            setDeadLine("")
            setSuccess(true)
        });;
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        navigate('/login')
    }

    return (
        <div className="bg-green-500 text-white rounded-2xl p-2">
            <h2 className="font-bold underline">New Project:</h2>

            <label for="projectName">Project's name:</label>
            <input
                value={project.name}
                id="projectName"
                placeholder='name of the project'
                onChange={(e) => setProject({ ...project, name: e.target.value })}
            />

            <label for="description">Project Description:</label>
            <input
                value={project.description}
                id="description"
                placeholder='description of the project'
                onChange={(e) => setProject({ ...project, description: e.target.value })}
            />

            <label for="deadline">Deadline:</label>
            <input type="date" id='deadline' onChange={(e) => setDeadLine(e.target.value)} />

            <label for="selectedPriority">Priority:</label>
            <select name="selectedPriority" id="selectedPriority"
                onChange={(e) => setSelectedPriority(e.target.value)}>
                <option value={1}>1 (High)</option>
                <option value={2}>2 (Middle)</option>
                <option value={3}>3 (Low)</option>
            </select>

            <button onClick={addProject}>
                Add Project
            </button>

            {
                projectError &&
                <div className='error-message'>{projectError}</div>
            }
            {
                success &&
                <div className='success-message'>Project added successfully</div>
            }
        </div>
    )
}

export default CreateProject