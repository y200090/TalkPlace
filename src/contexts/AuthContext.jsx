import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase.config";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [ currentUser, setCurrentUser ] = useState({});
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      // If user does not exist, return null
      console.log(user);
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const value = { currentUser };

  return (
    <AuthContext.Provider value={ value }>
      { !loading && children }
    </AuthContext.Provider>
  );
};
