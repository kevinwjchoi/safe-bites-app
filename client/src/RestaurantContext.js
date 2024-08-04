import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchNearbyRestaurants } from './yelpApi'; // Adjust the path as necessary

const RestaurantContext = createContext();
const RestaurantDispatchContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async (dataobj) => {
    setStatus('loading');
    setError(null);
    try {
      const data = await fetchNearbyRestaurants(dataobj);
      setRestaurants(data.businesses);
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
