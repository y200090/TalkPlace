import React, { useContext, useState } from 'react';
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase.config';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';
import { MdPublic, MdLockOutline } from 'react-icons/md';
import { FaImage } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const CreateRoom = ({ setOpenModal }) => {
  const { currentUser } = useContext(AuthContext);
  const [ roomIcon, setRoomIcon ] = useState(null);
  const [ photoURL, setPhotoURL ] = useState(null);
  const [ roomTitle, setRoomTitle ] = useState('');
  const [ visibility, setVisibility ] = useState('public');
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  const uploadIcon = (e) =>{
    setLoading(true);

    if (e.target.files[0]) {
      setRoomIcon(e.target.files[0]);
      // Show image preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);

    } else {
      setRoomIcon(null);
      setPhotoURL(null);
    }

    setLoading(false);
  };

  const createNewRoom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roomsDocRef = doc(collection(db, 'rooms'));
      let downloadURL = null;

      if (roomIcon) {
        const storageRef = ref(storage, 'rooms/' + roomsDocRef.id);
        await uploadBytes(storageRef, roomIcon);
        downloadURL = await getDownloadURL(storageRef);
      }
      
      await setDoc(roomsDocRef, {
        key: roomsDocRef.id, 
        title: roomTitle, 
        photoURL: downloadURL, 
        visibility: visibility, 
        admin: currentUser.uid, 
        members: {
          [currentUser.uid]: {
            userId: currentUser.uid, 
            lastTime: serverTimestamp(), 
            enteredAt: serverTimestamp()
          }
        }, 
        lastTime: serverTimestamp(), 
        lastMessage: '', 
        createdAt: serverTimestamp()
      });

      const chatsDocRef = doc(collection(db, 'rooms', roomsDocRef.id, 'chats'));
      await setDoc(chatsDocRef, {
        message: 'This is where the room starts.', 
        type: 'start', 
        id: chatsDocRef.id, 
        from: '', 
        postedAt: serverTimestamp(), 
        readBy: []
      });

      await updateDoc(doc(db, 'users', currentUser.uid), {
        roomKeys: arrayUnion(roomsDocRef.id)
      });

      console.log('create new room complete!');

      navigate('/' + roomsDocRef.id);
      
    } catch (error) {
      console.log(error);

    } finally {
      setOpenModal('');
      setLoading(false);
    }
  };
  
  return (
    <div onClick={() => setOpenModal('')} className='fixed h-screen w-screen flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-[2px] z-50'>
      <form onClick={(e) => e.stopPropagation()} onSubmit={createNewRoom} className='w-[500px] px-4 py-3 bg-[#1e2126] rounded-lg flex flex-col gap-y-12'>
        <div className='relative w-full flex items-center justify-center'>
          <button type='button' onClick={() => setOpenModal('')} className='absolute top-0 right-0 h-8 w-8'>
            <RxCross2 className='h-full w-full text-gray-400' />
          </button>
          <h1 className='text-4xl font-bold text-white mt-4'>
            Create a new room
          </h1>
        </div>

        <div className='w-full flex flex-col gap-y-6'>
          <div className='w-full flex items-center justify-center'>
            <label htmlFor="roomIcon" className={`rounded-full cursor-pointer`}>
              {photoURL ? (
                <img src={photoURL} className={`h-20 w-20 rounded-full ring-2 ring-neutral-500`} />
              ) : (
                <div className='relative h-24 w-24 flex flex-col items-center justify-center rounded-full ring-2 ring-neutral-500 bg-white'>
                  <FaImage className={`h-8 w-8 text-gray-600`} />
                  <span className='text-gray-600 uppercase font-bold'>
                    upload
                  </span>
                  <AiOutlinePlus className='absolute top-0 right-0 h-7 w-7 p-1 bg-blue-500 rounded-full text-white' />
                </div>
              )}
            </label>
            <input type="file" id='roomIcon' onChange={uploadIcon} className={`hidden`} />
          </div>
          
          <div className='w-full flex flex-col gap-y-2'>
            <label htmlFor="roomTitle" className='pl-0.5 text-white'>
              Room Title
            </label>
            <input type="text" id='roomTitle' placeholder='New Room' value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)} className='h-[50px] w-full px-3 py-1 outline-none border-2 border-blue-500 rounded-lg bg-[#1e2126] text-white' />
          </div>

          {/* <div className='w-full flex flex-col gap-y-2'>
            <label htmlFor="describe" className='pl-0.5 text-white'>
              Describe
            </label>
            <textarea id="describe" rows={3} maxLength={140} placeholder='Please introduce new room. (140)' onChange={(e) => setDescribe(e.target.value)} className='resize-none px-3 py-2 outline-none border-2 border-blue-500 rounded-lg bg-[#1e2126] text-white'></textarea>
          </div> */}

          <div className='relative w-full flex flex-col justify-center'>
            <span className='pl-0.5 text-white'>Visibility</span>

            <div className={`w-full px-3 py-2 mt-2 flex items-center justify-start gap-x-2 border rounded-lg ${visibility == 'public' ? 'border-blue-500' : 'border-transparent'}`}>
              <input type="radio" id='public' value='public' checked={visibility == 'public'} onChange={(e) => setVisibility(e.target.value)} />
              <label htmlFor="public" className='flex items-center justify-start gap-x-2'>
                <MdPublic className='h-7 w-7 text-white' />
                <div className='w-full flex flex-col'>
                  <span className='text-lg text-white'>Public</span>
                  <p className='text-xs text-gray-400'>
                    All users will have access to this room.
                  </p>
                </div>
              </label>
            </div>

            <div className={`w-full px-3 py-2 mt-2 flex items-center justify-start gap-x-2 border rounded-lg ${visibility == 'private' ? 'border-blue-500' : 'border-transparent'}`}>
              <input type="radio" id='private' value='private' checked={visibility == 'private'} onChange={(e) => setVisibility(e.target.value)} />
              <label htmlFor="private" className='flex items-center justify-start gap-x-2'>
                <MdLockOutline className='h-7 w-7 text-white' />
                <div className='w-full flex flex-col gap-y-[-10px]'>
                  <span className='text-lg text-white'>Private</span>
                  <p className='text-xs text-gray-400'>
                    Only authorized users will be able to enter this room.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className='w-full flex items-center justify-end gap-x-4'>
          <button type='button' onClick={() => setOpenModal('')} className='px-2 py-1 text-white font-bold'>
            Cancel
          </button>
          <button className='px-2 py-1 bg-blue-500 rounded-md text-white font-bold'>
            {!loading ? 'Create Room' : 'loading...'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;
