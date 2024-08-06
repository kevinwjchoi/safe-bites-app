import React, { createContext, useState, useContext } from 'react';

// Create context
const UserContext = createContext();
const UserDispatchContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false); // Track if session has been checked

  // Function to check user session
  const checkSession = async () => {
    if (sessionChecked) return true; // Avoid redundant checks

    setStatus('loading');
    try {
      const response = await fetch('/check_session'); 
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setStatus('succeeded');
        setSessionChecked(true); // Mark session as checked
        return true; // Return true if authenticated
      } else {
        setError(data.error);
        setStatus('failed');
        return false; // Return false if not authenticated
      }
    } catch (error) {
      setError(error.message);
      setStatus('failed');
      return false; // Return false if there was an error
    }
  };

  return (
    <UserContext.Provider value={{ user, status, error }}>
      <UserDispatchContext.Provider value={{ setUser, setStatus, setError, checkSession }}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

// Custom hooks for using context
export const useUserState = () => useContext(UserContext);
export const useUserDispatch = () => useContext(UserDispatchContext);
