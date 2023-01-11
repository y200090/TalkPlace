import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { db } from '../../firebase.config';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import { BsPersonFill } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { AiFillHome } from 'react-icons/ai';

const Navbar = ({ setOpenModal }) => {
  const { roomKey } = useParams();
  const { currentUser } = useContext(AuthContext);
  const { users } = useContext(UserContext);
  const [ userInfo, setUserInfo ] = useState(null);
  const [ rooms, setRooms ] = useState(null);

  // Get current user infomation
  useEffect(() => {
    if (users) {
      setUserInfo(users.filter((user) => (
        user.userId == currentUser.uid
      )));
    }
  }, [users]);
  
  // Get room infomation for user's room key
  useEffect(() => {
    if (userInfo && userInfo[0].roomKeys.length) {
      const unSubscribe = onSnapshot(collection(db, 'rooms'), 
        (querySnapshot) => {
          const results = querySnapshot.docs.map((doc) => (doc.data()));
          setRooms(results.filter((result) => (
            userInfo[0].roomKeys.includes(result.key)
          )));
        }, 
        (error) => {
          console.log(error);
        });

      return () => {
        unSubscribe();
      };
    }
  }, [userInfo]);

  return (
    // <nav className='fixed top-0 h-full w-[340px] flex flex-col bg-[#1e2126] z-10'>
      <>
        <div className='w-full flex items-center px-5 py-2'>
          <span className='text-white text-xl font-bold'>
            TalkPlace
          </span>
        </div>
      
        <div className='relative w-full pb-6 flex flex-col items-center'>
          <NavLink to={'/'} className='h-[70px] w-full px-5 flex items-center gap-x-4 hover:bg-[#12171d]'>
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} className='h-11 w-11 rounded-full ring-2 ring-neutral-500' />
            ) : (
              <span className='h-11 w-11 bg-white rounded-full ring-2 ring-neutral-500'>
                <BsPersonFill className='h-full w-full text-gray-500 translate-y-1.5 scale-110' />
              </span>
            )}

            <div className='w-[calc(100%-44px-16px-24px-16px)] overflow-hidden'>
              <span className='text-white text-lg font-bold'>
                {currentUser.displayName}
              </span>
              <p className='text-gray-400 truncate'>
                {/* {userInfo && userInfo[0].describe} */}
              </p>
            </div>

            <button type='button' className='h-6 w-6'>
              <AiFillHome className='h-full w-full text-white' />
            </button>
          </NavLink>

          <div className='h-[40px] w-full px-5 mt-3'>
            <button name='createRoom' type='button' onClick={(e) => setOpenModal(e.currentTarget.name)} className='h-full w-full bg-blue-500 rounded-md text-white text-xl font-bold'>
              Create New Room
            </button>
          </div>

          <div className='h-[40px] w-full px-5 mt-6'>
            <button name='searchRoom' type='button' onClick={(e) => setOpenModal(e.currentTarget.name)} className='h-full w-full flex items-center gap-x-1.5 pl-3 rounded-lg bg-slate-800 shadow-sm text-gray-400 text-start'>
              <BiSearch className='h-6 w-6' /> Search...
            </button>
          </div>
        </div>

        <ul className='w-full flex items-center'>
          <li className='w-1/2 pb-1 border-b-2 border-blue-400'>
            <button name='chatroom' type='button' className='w-full flex items-center justify-center text-white'>
              CHATROOMS
            </button>
          </li>
          <li className='w-1/2 pb-1'>
            <button name='chatroom' type='button' className='w-full flex items-center justify-center text-white'>
              FRIENDS
            </button>
          </li>
        </ul>

        {rooms && (
          <ul className='w-full flex flex-col items-center overflow-auto scrollbar-hidden'>
            {rooms?.sort((a, b) => (b.lastTime - a.lastTime)).map((room) => (
              <li key={room.key} className='relative h-[70px] w-full'>
                <NavLink to={'/' + room.key} className={`h-[70px] w-full px-5 flex items-center gap-x-4 hover:bg-[#12171d]`}>
                  {room.photoURL ? (
                    <img src={room.photoURL} className='h-11 w-11 rounded-full ring-2 ring-neutral-500' />
                  ) : (
                    <span className='h-11 w-11 rounded-full bg-white flex items-center justify-center text-2xl font-bold overflow-hidden ring-2 ring-neutral-500'>
                      {room.title}
                    </span>
                  )}

                  <div className='w-[calc(100%-44px-16px-12px-16px)] overflow-hidden'>
                    <span className='text-white text-lg font-bold'>
                      {room.title}
                    </span>
                    <p className='text-gray-400 truncate'>
                      {room.lastMessage}
                    </p>
                  </div>

                  {room.members[currentUser.uid] && room.lastTime > room.members[currentUser.uid].lastTime && room.key != roomKey &&
                    <span className='h-3 w-3 rounded-full bg-[#ff2669]'></span>
                  }
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </>
    // </nav>
  );
};

export default Navbar;
