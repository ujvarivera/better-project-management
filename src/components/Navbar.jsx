import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom'
import { auth } from '../firebase';
import SignOut from './SignOut';

const Navbar = () => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        <p>Loading...</p>
    }

    return (
        <nav className='navbar'>
            <Link to="/" className='navbar-link'>Better Project Management</Link>
                {
                    user ?
                        <>
                            <Link to="/chats" className='navbar-link'>Chat</Link>
                            <SignOut />
                        </>
                        :
                        <>
                            <Link to='/register' className='navbar-link'>Register</Link>
                            <Link to='/login' className='navbar-link'>Login</Link>
                        </>
                }
        </nav>
    )
}

export default Navbar