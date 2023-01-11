import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import ReactLogo from '../assets/react.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { auth } from '../../firebase.config';
import { HiArrowSmRight } from "react-icons/hi";
import { VscEyeClosed, VscEye } from 'react-icons/vsc';

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Sign In -talkPlace-';
  });

  // Redirect to user page if authentivated user
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, []);
  
  // sign in function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Pass authentication and login
      await signInWithEmailAndPassword(auth, email, password);
      // Get the URL to redirect to
      const req = location.state?.from?.pathname || '/';
      navigate(req);
      
    } catch (err) {
      console.log(err.message);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No such user exists. \nPlease try a different email or password.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled by the administrator. \nYou can send a request email or create a new account.');
          break;
        case 'auth/wrong-password':
          setError('Your password is incorrect. \nPlease try another password.');
          break;
        case 'auth/too-many-requests':
          setError('Access to this account has been temporarily disabled due to many failed login attempts. \nYou can try again later.');
          break;
        default:
          setError('An error unexpected by the administrator. \nPlease send a request email or access your account in a different way.')
          break;
      }
      
    } finally {
      setLoading(false);
    }
  }
  
  const [ isRevealPassword, setIsRevealPassword ] = useState(false);
  const toggleEyeIcon = () => {
    setIsRevealPassword((prevState) => !prevState);
  };
  
  return (
    <>
      { loading ? <p className='absolute text-white text-7xl'>Loading...</p> : '' }
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
            <p>Don't have an account?</p>
            <Link to='/register' className='flex items-center hover:underline'>
              Sign up <HiArrowSmRight />
            </Link>
          </div>
        </div>
      </header>
      <main className='relative h-screen w-screen'>
        <div className='w-full pt-24 flex justify-center'>
          <div className='w-full max-w-md m-5 p-5 bg-white bg-opacity-10 flex flex-col items-center'>
            <div className='w-full flex flex-col items-center'>
              <h1 className='w-full text-left text-xl'>
                Hello, welcome back.<br />
                We've been waiting for your return.
              </h1>
              <form onSubmit={handleLogin} className='w-full'>
                <div className='w-full mt-5'>
                  <label htmlFor="email">EMAIL</label>
                  <input type="email" id='email' value={email} autoFocus autoComplete='email' required onChange={(e) => setEmail(e.target.value)} className='w-full px-2 py-1 bg-transparent border rounded-lg outline outline-offset-0 outline-transparent focus:border-transparent focus:outline-2 focus:outline-blue-400 valid:border-transparent valid:outline-2 valid:outline-blue-400' />
                </div>
                <div className='w-full mt-5 z-10'>
                  <label htmlFor="password">PASSWORD</label>
                  <div className='relative w-full flex items-center'>
                    <input type={isRevealPassword ? 'text' : 'password'} id='password' value={password} required onChange={(e) => setPassword(e.target.value)} className='w-full px-2 py-1 bg-transparent border rounded-lg outline outline-offset-0 outline-transparent focus:border-transparent focus:outline-2 focus:outline-blue-400 valid:border-transparent valid:outline-2 valid:outline-blue-400 peer' />
                    <button type='button' onClick={toggleEyeIcon} className='absolute top-1/2 -translate-y-1/2 right-2 z-20 text-2xl text-white hidden peer-valid:block'>
                      {isRevealPassword ? <VscEye /> : <VscEyeClosed />}
                    </button>
                  </div>
                </div>
                <div className='w-full mt-5 text-right'>
                  <Link to='/' className='text-blue-400 text-sm hover:underline'>
                    Forgot password?
                  </Link>
                </div>
                <div className='w-full mt-5'>
                  <button className='w-full p-2 rounded-lg text-white bg-green-400 font-black'>
                    Sign in
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

export default Login;
