import React, { createContext, useContext, useState, useCallback } from 'react';

const RestaurantContext = createContext();
const RestaurantDispatchContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async (query) => {
    setStatus('loading');
    setError(null);
    try {
      const response = await fetch(`/restaurants/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      setRestaurants(data.results);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  }, []);

  return (
    <RestaurantContext.Provider value={{ restaurants, status, error }}>
      <RestaurantDispatchContext.Provider value={{ fetchRestaurants }}>
        {children}
      </RestaurantDispatchContext.Provider>
    </RestaurantContext.Provider>
  );
};

export const useRestaurantState = () => useContext(RestaurantContext);
export const useRestaurantDispatch = () => useContext(RestaurantDispatchContext);
