import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import Timeline from '../components/Timeline';
import Messenger from '../components/Messenger';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import Header from '../components/Header';
import { arrayUnion, collection, doc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Settings from '../components/Settings';

const ChatRoom = () => {
  const { roomKey } = useParams();
  const { currentUser } = useContext(AuthContext);
  const { users } = useContext(UserContext);
  const [ isNotFound, setIsNotFound ] = useState(false);
  const [ userInfo, setUserInfo ] = useState(null);
  const [ roomInfo, setRoomInfo ] = useState(null);
  const [ members, setMembers ] = useState(null);
  const [ openModal, setOpenModal ] = useState('');
  const [ chats, setChats ] = useState(null);
  const messengerRef = useRef();

  // Get current user infomation
  useEffect(() => {
    if (users) {
      setUserInfo(users.filter((user) => (
        user.userId == currentUser.uid
      )));
    }
  }, [users]);

  useEffect(() => {
    if (userInfo) {
      console.log('start');
      // Display NotFound page due to invalid room key obtained
      if (!userInfo[0].roomKeys.includes(roomKey)) {
        console.log('not found');
        setIsNotFound(true);
      }
      console.log('end');
    }
  }, [userInfo]);

  useEffect(() => {
    const unSubscribe = onSnapshot(doc(db, 'rooms', roomKey), 
      (doc) => {
        if (doc.exists()) {
          // console.log(doc.data());
          setRoomInfo(doc.data());
        }
      });

    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    if (roomInfo && roomInfo.members[currentUser.uid]) {
      // Get this room's chat log
      const q = query(collection(db, 'rooms', roomKey, 'chats'), where('postedAt', '>=', roomInfo.members[currentUser.uid].enteredAt));
      getDocs(q).then((querySnapshot) => {
        setChats(querySnapshot.docs.map((doc) => (doc.data())));

      }).catch((error) => {
        console.log(error);
      });

      // Get this room members infomation
      const results = users.filter((user) => (
        user.userId in roomInfo.members
      ));
      setMembers(results.map((result) => (Object.assign(result, roomInfo.members[result.userId]))));
    }
  }, [roomInfo]);

  useEffect(() => {
    if (chats) {
      chats.map(async (chat) => {
        if (!chat.readBy.includes(currentUser.uid)) {
          try {
            await updateDoc(doc(db, 'rooms', roomKey, 'chats', chat.id), {
              readBy: arrayUnion(currentUser.uid)
            });
            console.log('update read user complete!');
            await updateDoc(doc(db, 'rooms', roomKey), {
              ['members' + `.${currentUser.uid}` + '.lastTime']: serverTimestamp()
            });
            console.log('update user last entered time complete!');
  
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  }, [chats]);

  if (isNotFound) {
    return (
      <NotFound />
    );

  } else {
    return (
      // <div className='absolute top-0 left-[340px] h-full w-[calc(100%-340px)] bg-[#1e2126] z-10'>
        <>
          <header className={`fixed top-0 h-[70px] w-[calc(100%-340px-340px)] px-6 bg-[#1e2126] border-b border-b-[#1e2126] border-x border-x-slate-600 flex items-center justify-between gap-x-4 z-30`}>
            <Header roomInfo={roomInfo} members={members} setOpenModal={setOpenModal} />
          </header>

          <main className={`relative basis-auto w-[calc(100%-340px)] px-6 pt-[70px] border-x border-x-slate-600 overflow-auto z-20`}>
            <Timeline members={members} chats={chats} />
          </main>


          <footer ref={messengerRef} className={`relative w-[calc(100%-340px)] py-5 px-6 border-x border-x-slate-600`}>
            <Messenger />
          </footer>

          <aside className={`absolute top-0 right-0 h-full w-[340px] bg-[#1e2126] flex flex-col gap-y-8`}>
            <Settings roomInfo={roomInfo} members={members} setOpenModal={setOpenModal} />
          </aside>

          {/* {openModal == 'roomSettings' && <RoomSettings setOpenModal={setOpenModal} />} */}
        </>
      // </div>
    );
  }
};

export default ChatRoom;
