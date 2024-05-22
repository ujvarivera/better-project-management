import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const navigate = useNavigate();

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
  return (
    <div className="">
      <button className="hover:bg-purple-400 rounded-full p-2 hover:underline" onClick={async () => {
          const success = await signOut();
          if (success) {
            navigate('/login')
          }
        }}
      >
        Sign out
      </button>
    </div>
  );
};

export default SignOut