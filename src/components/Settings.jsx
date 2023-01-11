import React, { useState } from 'react';
import { BsPersonFill } from 'react-icons/bs';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

const Settings = ({ roomInfo, members, setOpenModal }) => {
  const [ closeMenu, setCloseMenu ] = useState(null);
  const [ isCloseMenu, setIsCloseMenu ] = useState(false);

  const toggleIcon = (e) => {
    setCloseMenu(e.currentTarget.name);
    setIsCloseMenu((prevState) => !prevState);
  };
  
  return (
    <>
      <div className='relative h-[70px] w-full flex items-center justify-center border-b border-b-slate-600 px-4'>
        {/* <button type='button' onClick={() => setOpenModal('')} className='absolute left-0 h-8 w-8'>
          <IoIosArrowBack className='h-full w-full text-white' />
        </button> */}
        {/* <span className='text-white font-bold'>
          {roomInfo?.title}'s room ({members?.length})
        </span> */}
        <p className='text-white text-2xl font-bold'>Settings</p>
      </div>

      <div className='w-full flex flex-col items-center gap-y-4'>
        {roomInfo && (
          <>
            {roomInfo.photoURL ? (
              <img src={roomInfo.photoURL} className='h-20 w-20 rounded-full ring-2 ring-neutral-500' />
            ) : (
              <span className='h-20 w-20 rounded-full bg-white flex items-center justify-center text-5xl font-bold overflow-hidden'>
                {roomInfo.title}
              </span>
            )}

            <div className='w-full'>
              <button name='admin' type='button' onClick={toggleIcon} className='h-7 w-full pl-2 mb-2 flex items-center gap-x-2 text-white'>
                {isCloseMenu && closeMenu == 'admin' ? <FaCaretRight /> : <FaCaretDown />}
                <span>Administrator</span>
              </button>

              <ul className={`w-full flex flex-col gap-y-4 ${isCloseMenu && closeMenu == 'admin' && 'hidden'}`}>
                {members?.sort((a, b) => (b.enteredAt - a.enteredAt)).map((member) => (
                  member.userId == roomInfo.admin && (
                    <li key={member.userId} className='h-[70px] w-full px-4 py-2 flex items-center gap-x-4 hover:bg-[#16191c] rounded-lg'>
                      {console.log(member)}
                      {member.photoURL ? (
                        <img src={member.photoURL} className='h-12 w-12 rounded-full ring-2 ring-neutral-500' />
                      ) : (
                        <span className='h-12 w-12 bg-white rounded-full ring-2 ring-neutral-500'>
                          <BsPersonFill className='h-full w-full text-gray-500 translate-y-1.5 scale-110' />
                        </span>
                      )}

                      <div>
                        <span className='text-white text-lg font-bold'>
                          {member.displayName}
                        </span>
                        <p className='text-gray-400 truncate'>
                          {member.describe}
                        </p>
                      </div>
                    </li>
                  )
                ))}
              </ul>
            </div>

            <div className='w-full'>
              <button name='members' type='button' onClick={toggleIcon} className='h-7 w-full pl-2 mb-2 flex items-center gap-x-2 text-white'>
                {isCloseMenu && closeMenu == 'members' ? <FaCaretRight /> : <FaCaretDown />}
                <span>Members</span>
              </button>

              <ul className={`w-full flex flex-col gap-y-4 ${isCloseMenu && closeMenu == 'members' && 'hidden'}`}>
                {members?.sort((a, b) => (b.enteredAt - a.enteredAt)).map((member) => (
                  member.userId != roomInfo.admin && (
                    <li key={member.userId} className='h-[70px] w-full px-4 py-2 flex items-center gap-x-4 hover:bg-[#16191c] rounded-lg'>
                      {member.photoURL ? (
                        <img src={member.photoURL} className='h-12 w-12 rounded-full ring-2 ring-neutral-500' />
                      ) : (
                        <span className='h-12 w-12 bg-white rounded-full ring-2 ring-neutral-500'>
                          <BsPersonFill className='h-full w-full text-gray-500 translate-y-1.5 scale-110' />
                        </span>
                      )}

                      <div>
                        <span className='text-white text-lg font-bold'>
                          {member.displayName}
                        </span>
                        <p className='text-gray-400 truncate'>
                          {member.describe}
                        </p>
                      </div>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Settings;
