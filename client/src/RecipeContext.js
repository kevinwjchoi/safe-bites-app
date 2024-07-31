import React, { createContext, useState, useContext } from 'react';
import { fetchRecipes } from './services/spoonacularApi'
const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRecipes = async (dataobj) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedRecipes = await fetchRecipes(dataobj);
            console.log(fetchedRecipes)
            console.log(fetchedRecipes.results)
            setRecipes(fetchedRecipes.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RecipeContext.Provider value={{ recipes, getRecipes, loading, error }}>
            {children}
        </RecipeContext.Provider>
    );
};

// Custom hook to use the RecipeContext
export const useRecipeContext = () => {
    return useContext(RecipeContext);
};
