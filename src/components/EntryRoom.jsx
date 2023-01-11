import { addDoc, arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';

const EntryRoom = ({ roomInfo, setRoomInfo}) => {
  const { currentUser } = useContext(AuthContext);
  const { userInfo } = useContext(UserContext);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  
  const handleEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const message = `${currentUser.displayName} has entered the room.`;
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        roomKeys: arrayUnion(roomInfo.key)
      });

      const chatsDocRef = doc(collection(db, 'rooms', roomInfo.key, 'chats'));
      await setDoc(chatsDocRef, {
        message: message, 
        type: 'start', 
        id: chatsDocRef.id, 
        from: {}, 
        postedAt: serverTimestamp(), 
        readBy: []
      });
      
      await updateDoc(doc(db, 'rooms', roomInfo.key), {
        ['members' + `.${currentUser.uid}`]: {
          userId: currentUser.uid, 
          lastTime: serverTimestamp(), 
          enteredAt: serverTimestamp()
        }, 
        lastTime: serverTimestamp(), 
      });

      console.log('entry this room complete!');

      navigate('/' + roomInfo.key);
      
    } catch (error) {
      console.log(error);

    } finally {
      setRoomInfo({});
      setLoading(false);
    }
  };
  
  return (
    <div onClick={() => setRoomInfo({})} className='fixed h-screen w-screen flex items-center justify-center z-50'>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleEntry} className='h-[500px] px-20 py-9 flex flex-col items-center gap-y-6 rounded-lg bg-red-400'>
        {roomInfo.photoURL ? (
          <img src={roomInfo.photoURL} className='h-20 w-20 rounded-full' />
        ) : (
          <span className='h-24 w-24 rounded-full bg-white flex items-center justify-center text-5xl font-bold overflow-hidden'>
            {roomInfo.title}
          </span>
        )}

        <div className='flex items-center gap-x-1'>
          <h1 className='text-white text-5xl font-bold'>
            {roomInfo.title}'s room
          </h1>
        </div>

        <div className='w-full flex flex-col justify-center items-center'>
          <div className='relative'>
            {Object.entries(roomInfo.members)?.sort((a, b) => (b[1].enteredAt - a[1].enteredAt)).map((member, index) => (
              (member[1].photoURL ? (
                <img src={member[1].photoURL} key={index} className={`h-12 w-12 rounded-full z-[calc(${index}+1)]`} />
              ) : (
                <span className={`h-12 w-12 rounded-full bg-white flex items-center justify-center text-3xl font-bold overflow-hidden z-[calc(${index}+1)]`}>
                  {member[1].displayName}
                </span>
              ))
            ))}
          </div>
          <p>
            {Object.keys(roomInfo.members).length} members are participating
          </p>
        </div>

        <button className='w-full px-4 py-3 bg-blue-500 rounded-md text-white text-2xl font-bold'>
          {!loading ? 'Entering this room' : 'loading...'}
        </button>

        <button type='button' onClick={() => setRoomInfo({})} className='w-full px-4 py-3 rounded-md text-white text-2xl'>
          I'll pass
        </button>
      </form>
    </div>
  );
};

export default EntryRoom;
