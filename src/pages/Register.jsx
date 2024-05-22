import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const handleRegister = () => {
    createUserWithEmailAndPassword(email, password).then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      if (user) {
        createNewUser();
        navigate('/')
      }
    })
  }

  const createNewUser = async () => {
    try {
      await addDoc(collection(db, 'users'), { email: email });

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
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
          <button onClick={handleRegister} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Register
          </button>
          <Link to='/login' className="block mt-4 text-center text-blue-500 hover:underline">
            I already have an account
          </Link>
          {
              error &&
              <p className="text-red-500 mt-4">Error: {error.message}</p>
          }
        </div>
      </div>
  );
};

export default Register;