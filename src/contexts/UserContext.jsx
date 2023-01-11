import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../../firebase.config";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [ users, setUsers ] = useState(null);

  useEffect(() => {
    const unSubscribe = onSnapshot(collection(db, 'users'), 
      (querySnapshot) => {
        setUsers(querySnapshot.docs.map((doc) => (doc.data())));
      }, 
      (error) => {
        console.log(error);
      });
    
    return () => {
      unSubscribe();
    };
  }, []);

  const value = { users };

  return (
    <UserContext.Provider value={ value }>
      { children }
    </UserContext.Provider>
  );
};
