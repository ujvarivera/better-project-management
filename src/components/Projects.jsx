import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([])
    const projectsRef = collection(db, "projects");

    const deleteProject = async(id) => {
        await deleteDoc(doc(db, 'projects', id))
    }

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
                            <div>{`${project.name} - Status: ${project.status} - Deadline: ${project.deadline} - Prior: ${project.priority}`}
                            <button onClick={() => deleteProject(project.id)}>X</button>
                            <Link to={`/projects/${project.id}`} state={{ projectId: project.id }}>Show more...</Link>
                            </div>
                        </div>
                    )) :
                    <div>Loading...</div>
            }
        </div>
    )
}

export default Projects