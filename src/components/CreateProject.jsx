import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
    const [project, setProject] = useState({ name: "", description: "" })
    const [projectError, setProjectError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setSuccess(false)
        }, 4000)
    }, [success])

    const checkFields = () => {
        if (project.name.length < 4) {
            setProjectError("Project name must be at least 4 characters.")
        }
    }

    const addProject = async () => {
        setProjectError("")
        checkFields()
        if (projectError.length > 1) {
            // Add a new document with a generated id
            const newProjectRef = doc(collection(db, "projects"));
            await setDoc(newProjectRef, project).then(function () {
                setProject({ name: "", description: "" })
                setSuccess(true)
            });
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        navigate('/login')
    }

    return (
        <div>
            <h2>New Project:</h2>
            <input
                value={project.name}
                placeholder='name of the project'
                onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
            <input
                value={project.description}
                placeholder='description of the project'
                onChange={(e) => setProject({ ...project, description: e.target.value })}
            />

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