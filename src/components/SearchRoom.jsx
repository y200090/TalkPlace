import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { UserContext } from '../contexts/UserContext';
import { BiSearch } from 'react-icons/bi';
import { MdBackspace } from 'react-icons/md';
import { AuthContext } from '../contexts/AuthContext';
import EntryRoom from './EntryRoom';

const SearchRoom = ({ setOpenModal }) => {
  const { currentUser } = useContext(AuthContext);
  const { users } = useContext(UserContext);
  const [ userInfo, setUserInfo ] = useState(null);
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ rooms, setRooms ] = useState([]);
  const [ results, setResults ] = useState([]);
  const [ roomInfo, setRoomInfo ] = useState({});
  const [ loading, setLoading ] = useState(false);

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
      if (userInfo[0].roomKeys.length) {
        const q = query(collection(db, 'rooms'), where('visibility', '==', 'public'));
        getDocs(q).then((querySnapshot) => {
          querySnapshot.docs.map((doc) => console.log(doc.data()));
          const snapshot = querySnapshot.docs.filter((doc) => (
            !userInfo[0].roomKeys.includes(doc.data().key)
          ));
          setRooms(snapshot.map((doc) => doc.data()));

        }).catch((error) => {
          console.log(error);
        });

      } else {
        const q = query(collection(db, 'rooms'), where('visibility', '==', 'public'));
        getDocs(q).then((querySnapshot) => {
          // querySnapshot.docs.map((doc) => console.log(doc.data()));
          setRooms(querySnapshot.docs.map((doc) => doc.data()));

        }).catch((error) => {
          console.log(error);
        });
      }
    }
  }, [userInfo]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setResults(rooms.filter((room) => (
      room.title.includes(e.target.value)
    )));
  };

  return (
    <>
      {Object.keys(roomInfo).length && <EntryRoom roomInfo={roomInfo} setRoomInfo={setRoomInfo} />}
    
      <div onClick={() => setOpenModal('')} className='fixed h-screen w-screen flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-[2px] z-40'>
        <div onClick={(e) => e.stopPropagation()} className='w-[500px] py-3 bg-[#1e2126] rounded-lg flex flex-col gap-y-3'>
          <div className='relative w-full px-4 pb-3 flex items-center border-b border-gray-600'>
            <BiSearch className='absolute h-6 w-6 text-gray-400' />

            <input type="text" placeholder='Search chatrooms' autoFocus value={searchQuery} onChange={handleSearch} className='h-full w-full pl-10 py-1 bg-transparent outline-none text-white' />

            <button type='button' onClick={() => {searchQuery ? setSearchQuery('') : setOpenModal('')}} className='absolute right-4 h-7 w-7'>
              <MdBackspace className='h-full w-full text-gray-400' />
            </button>
          </div>

          <nav className='w-full flex flex-col'>
            <ul>
              {!searchQuery ? (
                <span className='block w-full text-center px-5 py-20 text-gray-400 text-lg font-bold'>
                  Results will be displayed here
                </span>
              ) : (
                (!results.length ? (
                  <span className='block w-full text-center px-5 py-20 text-gray-400 text-lg font-bold'>
                    No results for "{searchQuery}"
                  </span>
                ) : (
                  <>
                    <span className='block px-5 pb-3 text-gray-400 text-lg font-bold'>
                      Results
                    </span>
                    
                    {results.map((result) => (
                      <li key={result.key} onClick={() => setRoomInfo(result)} className='h-[70px] w-full px-5 flex items-center gap-x-4 hover:bg-[#12171d] cursor-pointer'>
                        {result.photoURL ? (
                          <img src={result.photoURL} className='h-11 w-11 rounded-full' />
                        ) : (
                          <span className='h-11 w-11 rounded-full bg-white flex items-center justify-center text-2xl font-bold overflow-hidden'>
                            {result.title}
                          </span>
                        )}
        
                        <div className='w-[calc(100%-44px-20px)] overflow-hidden'>
                          <span className='text-white text-lg font-bold'>
                            {result.title}
                          </span>
                          <p className='text-gray-400'>
                            Created at: {`${result.createdAt.toDate().getFullYear()}/${('0' + (result.createdAt.toDate().getMonth() + 1)).slice(-2)}/${('0' + result.createdAt.toDate().getDate()).slice(-2)} ${('0' + result.createdAt.toDate().getHours()).slice(-2)}:${('0' + result.createdAt.toDate().getMinutes()).slice(-2)}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </>
                ))
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SearchRoom;
