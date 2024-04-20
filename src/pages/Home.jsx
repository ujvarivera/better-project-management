import React from 'react'
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Home = () => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        <p>Loading...</p>
    }

    return (
        <div>
            <p>{user?.email}</p>
        </div>
    )
}

export default Home