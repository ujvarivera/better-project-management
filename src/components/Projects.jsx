import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import {Button} from "@/components/ui/button.jsx";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const projectsRef = collection(db, "projects");

    const deleteProject = async(id) => {
        await deleteDoc(doc(db, 'projects', id));
    };

    useEffect(() => {
        const queryProjects = query(
            projectsRef,
            orderBy("deadline", "asc"),
            orderBy("priority", "asc")
        );
        const unsubscribe = onSnapshot(queryProjects, (snapshot) => {
            let fetchedProjects = [];
            snapshot.forEach((doc) => {
                fetchedProjects.push({ ...doc.data(), id: doc.id });
            });
            setProjects(fetchedProjects);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="p-3 bg-blue-950 rounded-xl border-4 border-blue-800">
            <h2 className="text-2xl font-bold text-white ">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {
                    projects ?
                        projects.map((project) => (
                            <div key={project.id} className="bg-purple-600 p-4 rounded-xl text-white">
                                <h3 className="text-xl font-bold">{project.name}</h3>
                                <hr className="my-2 border-white w-full"/>
                                <p>Status: {project.status}</p>
                                <p>Deadline: {project.deadline}</p>
                                <p>Priority: {project.priority}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <button className="rounded-full text-white p-2 hover:bg-blue-200 hover:text-black"
                                            onClick={() => deleteProject(project.id)}>Delete
                                    </button>
                                    <Link className="text-white hover:underline" to={`/projects/${project.id}`}
                                          state={{projectId: project.id}}>Show more...</Link>
                                </div>

                            </div>
                        )) :
                        <div>Loading...</div>
                }
            </div>
        </div>
    );
}

export default Projects;
