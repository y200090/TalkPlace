import React, { useContext } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Top from './pages/Top';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import User from './pages/User';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';
import { UserContextProvider } from './contexts/UserContext';

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const ProtectedRoute = () => {
    if (!currentUser) {
      return <Navigate to={'/login'} state={{ from: location }} replace />;
    }
    return <Outlet />;
  };
  
  return (
    <>
      <Routes>
        <Route path='/' element={currentUser ? 
          <UserContextProvider>
            <User />
          </UserContextProvider> : <Top />}
        >
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path=':roomKey' element={<ChatRoom />} />
          </Route>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/profile' element={<Profile />} />
        <Route path='/*' element={<NotFound />} />
        {/* {currentUser ? (
          <Route path='/' element={
            <UserContextProvider>
              <User />
            </UserContextProvider>
          }>
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path=':roomKey' element={<ChatRoom />} />
            </Route>
          </Route>
        ) : (
          <>
            <Route path='/' element={<Top />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/register/profile' element={<Profile />} />
            <Route path='/*' element={<NotFound />} />
          </>
        )} */}
      </Routes>
    </>
  );
};

export default App;
