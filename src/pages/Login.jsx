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
    <div className="login">
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
      <button onClick={handleLogin}>
        Login
      </button>

      <Link to='/register'>I don't have an account</Link>

      {
        error &&
        <p>Error: {error.message}</p>
      }
    </div>
  );
};

export default Login