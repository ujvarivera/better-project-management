import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';

const Projects = () => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const getProjects = async () => {
            const q = query(collection(db, 'projects'));

            const querySnapshot = await getDocs(q);

            const fetchedProjects = [];
            querySnapshot.forEach((doc) => {
                // setProjects((prev) => ([...prev, { ...doc.data(), id: doc.id }]));
                fetchedProjects.push({...doc.data(), id: doc.id});
            });
            setProjects(fetchedProjects);
        }
        getProjects()
    }, [])

    return (
        <div>
            <h2>Projects</h2>
            {
                projects ?
                    projects.map((project) => (
                        <div key={project.id}>{project.name}</div>
                    )) :
                    <div>Loading...</div>
            }
        </div>
    )
}

export default Projects