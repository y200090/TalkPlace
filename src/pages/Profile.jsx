import { updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase.config';
import { AuthContext } from '../contexts/AuthContext';
import { FaUserPlus } from 'react-icons/fa';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [ userIcon, setUserIcon ] = useState(null);
  const [ photoURL, setPhotoURL ] = useState(null);
  const [ displayName, setDisplayName ] = useState(currentUser?.email.split('@')[0]);
  const [ describe, setDescribe ] = useState('');
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Set Up Profile -TalkPlace-';
  });

  // Redirect to register page if not signed up
  useEffect(() => {
    if (!location.state?.referrer || !currentUser) {
      navigate('/register');
    }
  }, []);

  const changeUserIcon = (e) => {
    setLoading(true);

    if (e.target.files[0]) {
      setUserIcon(e.target.files[0]);
      // Show image preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);

    } else {
      setUserIcon(null);
      setPhotoURL(null);
    }

    setLoading(false);
  };

  const handleSetUpProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userIcon) {
        const storageRef = ref(storage, 'users/' + currentUser.uid);
        // Upload new user icon
        await uploadBytes(storageRef, userIcon);
        // Get image path of icon uploaded to firebase(storage)
        const downloadURL = await getDownloadURL(storageRef);
        // Set up image path for user icon in firebase(storage)
        await updateProfile(currentUser, {
          photoURL: downloadURL
        });
      }
      
      // Set up display name
      await updateProfile(currentUser, {
        displayName: displayName
      });

      // Initialize user information
      await setDoc(doc(db, 'users', currentUser.uid), {
        userId: currentUser.uid, 
        photoURL: currentUser.photoURL, 
        displayName: currentUser.displayName, 
        email: currentUser.email, 
        describe: describe, 
        friendIds: [], 
        roomKeys: [], 
        createdAt: serverTimestamp()
      });

      // Redirect to user page if set up is complete
      navigate('/');
      
    } catch (err) {
      console.log(err.message);
      switch (err.code) {
        case 'storage/object-not-found':
          setError("File doesn't exist.");
          break;
        case 'storage/unauthorized':
          setError("User doesn't have permission to access the object.");
          break;
        case 'storage/canceled':
          setError('User canceled the upload.');
          break;
        case 'storage/unknow':
          setError('Unknown error occurred, inspect the server response.');
          break;
        default:
          setError('Failed to set up profile.');
          break;
      }

    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      { loading ? <p className='absolute top-1/2 text-black text-9xl'>Loading...</p> : ''}

      <div className='absolute h-screen w-screen bg-gradient-to-r from-indigo-500 to-pink-500 -z-10'>
        <div className='h-full w-full bg-black bg-opacity-40'></div>
      </div>
      <main className='relative h-screen w-screen'>
        <div className='h-4/5 w-full pt-24 bg-black flex justify-center'>
          <div className='h-full w-full max-w-md p-5 bg-blue-500'>
            <div className='h-full w-full bg-yellow-200 flex flex-col'>
              <h1>
                You have successfully created your account.<br />
                Next up is your profile settings.
              </h1>
              <form onSubmit={handleSetUpProfile} className='w-full bg-red-600'>
                <div className='relative w-full mt-5 flex justify-center'>
                  <div className='relative h-16 w-16 flex flex-col items-center'>
                    <label htmlFor="userIcon" className='bg-white flex justify-center rounded-full overflow-hidden'>
                      {photoURL ? <img src={photoURL} /> : <FaUserPlus />}
                    </label>
                    <input type="file" id='userIcon' onChange={changeUserIcon} className='hidden' />
                  </div>
                </div>
                <div className='relative w-full mt-5 flex flex-col'>
                  <label htmlFor="displayName">Display Name</label>
                  <input type="text" id='displayName' value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className='relative w-full mt-5 flex flex-col'>
                  <label htmlFor="describe">Describe</label>
                  <textarea id='describe' rows={3} maxLength={140} placeholder="Please introduce you." onChange={(e) => setDescribe(e.target.value)} className='resize-none rounded-md'></textarea>
                </div>
                <div className='w-full mt-5'>
                  <button className='w-full p-3 bg-green-400'>
                    Start
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
