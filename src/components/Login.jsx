import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Signed In User: {user.user.email}</p>
      </div>
    );
  }
  return (
    <div className="App">
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
      <button onClick={() => signInWithEmailAndPassword(email, password)}>
        Login
      </button>
    </div>
  );
};

export default Login