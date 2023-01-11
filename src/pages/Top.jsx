import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Top = () => {
  useEffect(() => {
    document.title = 'TalkPlace';
  });
  
  return (
    <>
      <header className='fixed h-20 w-screen px-5 bg-red-400 flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold font-serif'>LOGO</h1>
        </div>
        <div className=' flex gap-x-3'>
          <Link to='/login' className='px-2 py-1 bg-blue-400'>Sign in</Link>
          <Link to='' className='uppercase px-2 py-1 bg-yellow-300'>Guest</Link>
        </div>
      </header>

      <div className='h-screen w-screen pt-20'>
        <main className='h-full w-full bg-cyan-400 flex items-center justify-center flex-col'>
          <Link to='/register' className='text-2xl font-medium p-3 bg-green-400'>Get Started</Link>
        </main>
      </div>
    </>
  );
};

export default Top;
