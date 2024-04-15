import React from 'react'
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignOut from './SignOut';
import { Link } from 'react-router-dom';

const Home = () => {
    const [user, loading, error] = useAuthState(auth);
    // console.log(user);
    return (
        <div>
            <p>{user?.email}</p>
            {
                user?.email ?
                    <SignOut /> :
                    <>
                        <Link to='/register'>Register</Link>
                        <Link to='/login'>Login</Link>
                    </>
            }
        </div>
    )
}

export default Home