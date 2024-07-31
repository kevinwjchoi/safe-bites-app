import React, { createContext, useState, useContext } from 'react';
import { fetchRecipes } from './services/spoonacularApi';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true); // Manage the visibility of the search form

  const getRecipes = async (dataobj) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRecipes = await fetchRecipes(dataobj);
      setRecipes(fetchedRecipes.results); // Ensure this matches your API response
      setShowForm(false); // Hide the form when recipes are fetched
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setRecipes([]);
    setError(null);
    setShowForm(true); // Show the form again when resetting
  };

  return (
    <RecipeContext.Provider value={{ recipes, getRecipes, loading, error, showForm, setShowForm, resetState }}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom hook to use the RecipeContext
export const useRecipeContext = () => {
  return useContext(RecipeContext);
};
