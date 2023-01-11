import React, { useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import Navbar from '../components/Navbar';
import CreateRoom from '../components/CreateRoom';
import SearchRoom from '../components/SearchRoom';

const User = () => {
  const { currentUser } = useContext(AuthContext);
  // const { userInfo } = useContext(UserContext);
  const [ openModal, setOpenModal ] = useState('');
  return (
    <>    
      <nav className={`fixed top-0 h-full w-[340px] flex flex-col bg-[#1e2126] z-10`}>
        <Navbar setOpenModal={setOpenModal} />
      </nav>

      <div className={`absolute top-0 left-[340px] h-full w-[calc(100%-340px)] flex flex-col justify-end bg-[#18191e] z-10`}>
        <Outlet />
      </div>

      {openModal == 'createRoom' && <CreateRoom setOpenModal={setOpenModal} />}
      {openModal == 'searchRoom' && <SearchRoom setOpenModal={setOpenModal} />}
    </>
  );
};

export default User;
