import { addDoc, arrayUnion, collection, doc, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase.config';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import { BiLink } from 'react-icons/bi';
import { IoIosSend } from 'react-icons/io';
import { BsCardImage } from 'react-icons/bs';

const Messenger = () => {
  const { roomKey } = useParams();
  const { currentUser } = useContext(AuthContext);
  // const { userInfo } = useContext(UserContext);
  const [ message, setMessage ] = useState('');
  const [ photoURL, setPhotoURL ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const textRef = useRef();
  const textBaseHeight = useRef(24);
  // const textRow = useRef(1);
  // const [ textRow, setTextRow ] = useState(1);

  const uploadImage  = (e) => {

  };

  const changeTextarea = (e) => {
    setMessage(e.target.value);

    textRef.current.style.height = textBaseHeight.current + 'px';
    textRef.current.style.height = textRef.current.scrollHeight + 'px';
  };
  
  const handleMessage = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const chatsDocRef = doc(collection(db, 'rooms', roomKey, 'chats'));
      await setDoc(chatsDocRef, {
        message: (photoURL ? photoURL : message), 
        type: (photoURL ? 'photoURL' : 'text'), 
        id: chatsDocRef.id, 
        from: currentUser.uid, 
        postedAt: serverTimestamp(), 
        readBy: [currentUser.uid]
      });

      await updateDoc(doc(db, 'rooms', roomKey), {
        ['members' + `.${currentUser.uid}` + '.lastTime']: serverTimestamp(), 
        lastTime: serverTimestamp(), 
        lastMessage: (photoURL ? <BsCardImage /> : message)
      });

    } catch (err) {
      console.log(err);

    } finally {
      setMessage('');
      setLoading(false);
    }
  };
  
  return (
    // <footer className='fixed bottom-0 h-[100px] w-[calc(100%-340px)] pt-[30px] pb-[20px] px-6'>
      <>
        <form onSubmit={handleMessage} className='w-full px-3 py-3 bg-[#1e2126] rounded-lg flex items-end'>
          <div className='h-7 w-7'>
            <label htmlFor="image">
              <BiLink className='h-full w-full text-[#9ca1aa] cursor-pointer' />
            </label>
            <input type="file" id='image' onChange={uploadImage} className='hidden' />
          </div>

          <span className='h-7 w-[2px] ml-3 bg-blue-500'></span>

          <div className='w-[calc(100%-28px-12px-2px-28px)] pl-3'>
            <textarea ref={textRef} placeholder='Type something...' value={message} onChange={changeTextarea} className='resize-none h-[24px] w-full pr-3 flex items-center bg-transparent outline-none text-white'></textarea>
            {/* <input type="text" placeholder='Type something...' value={message} onChange={(e) => setMessage(e.target.value)} className='h-full w-full pr-3 py-2 text-white bg-transparent outline-none' /> */}
          </div>

          <button className='h-7 w-7'>
            <IoIosSend className='h-full w-full text-blue-500' />
          </button>
        </form>
      </>
    // </footer>
  );
};

export default Messenger;
