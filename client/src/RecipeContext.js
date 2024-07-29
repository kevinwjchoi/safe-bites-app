import React, { createContext, useState, useContext, useCallback } from 'react';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (query) => {
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch(`/recipes/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data.results);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, status, error, fetchRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => useContext(RecipeContext);
