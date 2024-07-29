import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  user: null,
  posts: [],
};

// Action types
const actionTypes = {
  SET_USER: 'SET_USER',
  SET_POSTS: 'SET_POSTS',
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.SET_POSTS:
      return { ...state, posts: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using context
export const useAppContext = () => {
  return useContext(AppContext);
};
