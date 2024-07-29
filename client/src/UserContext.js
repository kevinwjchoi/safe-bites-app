import React, { createContext, useState, useContext } from 'react';

// Create context
const UserContext = createContext();
const UserDispatchContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  return (
    <UserContext.Provider value={{ user, status, error }}>
      <UserDispatchContext.Provider value={{ setUser, setStatus, setError }}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

// Custom hooks for using context
export const useUserState = () => useContext(UserContext);
export const useUserDispatch = () => useContext(UserDispatchContext);
