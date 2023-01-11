import { signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.config';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut(auth);
    navigate('/');
  };
  
  return (
    <>
      <div className={`h-full w-full flex items-center justify-center`}>
        <button onClick={handleLogout} className='p-2 bg-blue-500 text-white text-xl font-bold'>
          Sign out
        </button>
      </div>
    </>
  );
};

export default Home;
