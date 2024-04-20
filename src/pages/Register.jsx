import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

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
        navigate('/')
      }
    })
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="register">
      <input
        type="email"
        value={email}
        placeholder='email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder='password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>
        Register
      </button>

      <Link to='/login'>I already have an account</Link>

      {
        error &&
        <p>Error: {error.message}</p>
      }

    </div>
  );
};

export default Register