import React from 'react'
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import CreateProject from '../components/CreateProject';
import Projects from '../components/Projects';

const Home = () => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        <p>Loading...</p>
    }

    return (
        <div className="flex flex-col gap-3 h-full">
            <p className="bg-blue-950 text-white rounded-full p-2 text-sm border-4 border-blue-800">Signed in as: {user?.email}</p>
            <CreateProject />
            <Projects />
        </div>
    )
}

export default Home