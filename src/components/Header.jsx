import React, { useContext } from 'react';
import { MdMenu } from 'react-icons/md';
import { AuthContext } from '../contexts/AuthContext';
import { BsPersonFill } from 'react-icons/bs';

const Header = ({ roomInfo, members, setOpenModal }) => {
  // const { currentUser } = useContext(AuthContext);
  
  return (
    // <header className='fixed h-[70px] w-[calc(100%-340px)] px-6 border-b border-[#1e2126] flex items-center justify-between gap-x-4'>
      <>
        <div className='h-full w-full flex items-center gap-x-8'>
          <h1 className='h-full flex items-center text-white text-3xl font-bold'>
            {roomInfo?.title}'s room
          </h1>

          {members && (
            <div className='relative h-full flex items-center gap-x-2'>
              {members?.sort((a, b) => (a.enteredAt - b.enteredAt)).map((member) => (
                (member.photoURL ? (
                  <img src={member.photoURL} key={member.userId} className={`h-10 w-10 rounded-full ring-2 ring-neutral-500`} />
                ) : (
                  <span key={member.userId} className={`h-10 w-10 bg-white rounded-full ring-2 ring-neutral-500 overflow-hidden`}>
                    <BsPersonFill className='h-full w-full text-gray-500 translate-y-1.5 scale-110' />
                  </span>
                ))
              ))}
            </div>
          )}
        </div>

        <div className='h-full flex gap-x-6'>
          <div className='h-full flex items-center'>
            <button name='roomSettings' type='button' onClick={(e) => setOpenModal(e.currentTarget.name)} className='h-9 w-9'>
              <MdMenu className='h-full w-full text-white' />
            </button>
          </div>
        </div>
      </>
    // </header>
  );
};

export default Header;
