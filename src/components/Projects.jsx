import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';

const Projects = () => {
    const [projects, setProjects] = useState([])
    const projectsRef = collection(db, "projects");

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
    }, [])

    return (
        <div>
            <h2>Projects</h2>
            {
                projects ?
                    projects.map((project) => (
                        <div key={project.id}>
                            <div>{`${project.name} - Deadline: ${project.deadline} - Prior: ${project.priority}`}</div>
                        </div>
                    )) :
                    <div>Loading...</div>
            }
        </div>
    )
}

export default Projects