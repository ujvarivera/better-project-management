import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(email, password).then((userCredential) => {
            // Logged in
            const user = userCredential.user;
            if (user) {
                navigate('/')
            }
        })
    }

    return (
        <div className="flex items-center justify-center h-screen overflow-hidden">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <input
                    type="email"
                    value={email}
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="password"
                    value={password}
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                />
                <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    Login
                </button>
                <Link to='/register' className="block mt-4 text-center text-blue-500 hover:underline">
                    I don't have an account
                </Link>
                {
                    error &&
                    <p className="text-red-500 mt-4">Error: {error.message}</p>
                }
            </div>
        </div>
    );
};

export default Login