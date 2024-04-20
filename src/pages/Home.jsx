import React from 'react'
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import CreateProject from '../components/CreateProject';

const Home = () => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        <p>Loading...</p>
    }

    return (
        <div>
            <p>{user?.email}</p>
            <CreateProject />
        </div>
    )
}

export default Home