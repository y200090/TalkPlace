import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import ReactLogo from '../assets/react.svg';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.config';
import { AuthContext } from '../contexts/AuthContext';
import { HiArrowSmRight } from 'react-icons/hi';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const Register = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign Up -TalkPlace-';
  });

  // Redirect to user page if authenticated user
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, []);

  // Sign up function
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create new user
      await createUserWithEmailAndPassword(auth, email, password);
      // Next up is user profile settings
      navigate('profile', { state: { referrer: '/register' } });
      
    } catch (err) {
      console.log(err.message);
      switch (err.code) {
        case 'auth/weak-password':
          setError('This password is weak. \nPlease enter a stronger password.');
          break;
        case 'auth/email-already-exists':
          setError('This email is already in use by an existing user. \nPlease enter another email.');
          break;
        default:
          setError('Failed to create account. \nPlease try again in a place with a good network environment or send a request email.');
          break;
      }

    } finally {
      setLoading(false);
    } 
  };
  
  const [ isRevealPassword, setIsRevealPassword ] = useState(false);
  const toggleEyeIcon = () => {
    setIsRevealPassword((prevState) => !prevState);
  };
  
  return (
    <>
      { loading ? <p className='absolute top-1/2 text-black text-9xl'>Loading...</p> : ''}
      <div className='absolute h-screen w-screen bg-gradient-to-r from-indigo-500 to-pink-500 -z-10'>
        <div className='h-full w-full bg-black bg-opacity-40'></div>
      </div>
      <header className='fixed top-0 w-full px-7 py-5 z-50'>
        <div className='h-full w-full max-w-7xl mx-auto flex items-center justify-between'>
          <div className='h-full flex items-center justify-center'>
            <Link to='/'>
              <img src={ReactLogo} alt="App logo" className='h-full' />
            </Link>
          </div>
          <div className='h-full flex items-center gap-x-3 text-white text-lg'>
            <p>Already have an account?</p>
            <Link to='/login' className='flex items-center hover:underline'>
              Sign in <HiArrowSmRight />
            </Link>
          </div>
        </div>
      </header>
      <main className='relative h-screen w-screen'>
        <div className='w-full pt-24 flex justify-center'>
          <div className='w-full max-w-md m-5 p-5 bg-red-300 flex flex-col items-center'>
            <div className='w-full flex flex-col'>
              <h1 className='w-full text-left text-xl'>
                Welcome to TalkPlace.<br />
                Let's create your own account.
              </h1>
              <form onSubmit={handleRegister} className='w-full bg-yellow-300'>
                <div className='w-full mt-5'>
                  <label htmlFor="email">EMAIL</label>
                  <input type="email" id='email' value={email} autoFocus autoComplete='email' required onChange={(e) => setEmail(e.target.value)} className='w-full px-2 py-1 bg-blue-200' />
                </div>
                <div className='w-full mt-5 z-10'>
                  <label htmlFor="password">PASSWORD</label>
                  <div className='relative w-full flex items-center'>
                    <input type={isRevealPassword ? 'text' : 'password'} id='password' value={password} required onChange={(e) => setPassword(e.target.value)} className='w-full px-2 py-1 bg-blue-200' />
                    <button type='button' className='absolute top-1/2 -translate-y-1/2 right-2 z-20 text-2xl' onClick={toggleEyeIcon}>
                      {isRevealPassword ? <VscEye /> : <VscEyeClosed />}
                    </button>
                  </div>
                </div>
                <div className='w-full mt-5'>
                  <button className='w-full p-3 bg-green-400'>
                    Create an account
                  </button>
                </div>
              </form>
              <p className='text-red-700'>{error}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
