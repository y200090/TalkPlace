import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Timeline = ({ members, chats }) => {
  const { currentUser } = useContext(AuthContext);
  const chatRef = useRef();

  const getMemberInfo = (userId) => {
    return (
      members.filter((member) => (
        member.userId == userId
      ))
    );
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth'});
  }, [chats]);

  return (
    // <main className='absolute top-[70px] h-[calc(100%-70px-100px)] w-full px-6 flex flex-col gap-y-5 overflow-y-scroll'>
      <>
        {chats && (
          <div className='w-full mt-auto flex flex-col gap-y-5'>
            {chats?.map((chat, index) => (
              <div ref={chatRef} key={index} className='relative w-full'>
                {!chat.from ? (
                  (chat.type == 'start' ? (
                    <div className='w-full px-3 py-1 rounded-2xl bg-gray-500 flex items-center justify-center break-words'>
                      <p className='text-white'>{chat.message}</p>
                    </div>
                  ) : (
                    <div className='w-full flex justify-center'>
                      <div className='px-3 py-1 rounded-2xl bg-gray-500 flex items-center break-words'>
                        <p className='text-white'>{chat.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  // from current user
                  chat.from == currentUser.uid ? (
                    <div className='w-full flex items-center justify-end gap-x-2'>
                      <div className='flex flex-col items-end justify-center'>
                        {chat.readBy.length > 1 && 
                          <span className='text-white text-sm'>
                            {chat.readBy.length == members.length ? 'All' : chat.readBy.length - 1} read
                          </span>
                        }
                        <span className='text-white text-sm'>
                          {`${chat.postedAt.toDate().getHours()}:${('0' + chat.postedAt.toDate().getMinutes()).slice(-2)}`}
                        </span>
                      </div>

                      <div className='relative p-2 flex items-center justify-center bg-sky-500 rounded-lg break-words'>
                        <p className='text-lg'>{chat.message}</p>
                        <span className='messagebox-right'></span>
                      </div>
                    </div>
                  ) : (
                    // from other user
                    <div className='w-full flex justify-start gap-x-4'>
                      {getMemberInfo(chat.from).length && (
                        <>
                          {getMemberInfo(chat.from)[0].photoURL ? (
                            <img src={getMemberInfo(chat.from)[0].photoURL} className='h-8 w-8 rounded-full' />
                            ) : (
                              <span className='h-8 w-8 rounded-full bg-white flex items-center justify-center text-2xl font-bold overflow-hidden'>
                              {getMemberInfo(chat.from)[0].displayName}
                            </span>
                          )}
                          <div className='flex items-end gap-x-2'>
                            <div className='flex flex-col items-start'>
                              <span className='text-white text-sm -translate-x-2'>
                                {getMemberInfo(chat.from)[0].displayName}
                              </span>
                              
                              <div className='flex items-end justify-start gap-x-2'>
                                <div className='relative p-2 flex items-center justify-center bg-white rounded-lg break-words'>
                                  <p className='text-lg'>{chat.message}</p>
                                  <span className='messagebox-left'></span>
                                </div>

                                <span className='text-white text-sm'>
                                  {`${chat.postedAt.toDate().getHours()}:${('0' + chat.postedAt.toDate().getMinutes()).slice(-2)}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </>
    // </main>
  );
};

export default Timeline;
