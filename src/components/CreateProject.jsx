import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button.jsx";

const CreateProject = () => {
    const [project, setProject] = useState({ name: "", description: "" })
    const [selectedPriority, setSelectedPriority] = useState(1)
    const [deadline, setDeadLine] = useState("")
    const [status, setStatus] = useState("Open")
    const [projectError, setProjectError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, loading] = useAuthState(auth);
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
        });
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        navigate('/login')
    }

    return (
        <div className="bg-blue-950 text-white rounded-2xl p-2 border-4 border-blue-800">
            <h2 className="font-bold text-2xl mb-2">New Project:</h2>
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="projectName">Project&apos;s name:</label>
                        <Input
                            value={project.name}
                            id="projectName"
                            placeholder='name of the project'
                            onChange={(e) => setProject({...project, name: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="description">Project Description:</label>
                        <Input
                            value={project.description}
                            id="description"
                            placeholder='description of the project'
                            onChange={(e) => setProject({...project, description: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="deadline">Deadline:</label>
                        <Input type="date" id='deadline' className="text-gray-500" onChange={(e) => setDeadLine(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="text-white bg-purple-600 hover:bg-white hover:text-purple-600">Priority</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuRadioGroup value={selectedPriority} onValueChange={setSelectedPriority}>
                                    <DropdownMenuRadioItem value={1}>High (1)</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={2}>Intermediate (2)</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={3}>Low (3)</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex items-end mt-2">
                    <Button onClick={addProject}
                            className="self-end mt-2 bg-purple-600 hover:bg-white hover:text-purple-600">
                        Add Project
                    </Button>
                </div>
            </div>
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

export default CreateProject;
