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
        <nav className='fixed top-0 left-0 w-full z-10 bg-purple-600 flex flex-row justify-between pl-10 pr-10 text-white text-2xl p-2 mb-3'>
            <Link to="/" className='hover:bg-purple-400 rounded-full p-2 hover:underline'>Better Project Management</Link>
                {
                    user ?
                        <div className="flex flex-row items-center justify-center">
                            <Link to="/chats" className='hover:bg-purple-400 rounded-full p-2 hover:underline'>Chat</Link>
                            <SignOut />
                        </div>
                        :
                        <div className="flex flex-row items-center justify-center">
                            <Link to='/register' className='hover:bg-green-600 rounded-full p-2 hover:underline'>Register</Link>
                            <Link to='/login' className='hover:bg-green-600 rounded-full p-2 hover:underline'>Login</Link>
                        </div>
                }
        </nav>
    )
}

export default Navbar