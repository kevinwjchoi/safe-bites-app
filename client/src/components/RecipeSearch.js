import React, { useState } from 'react';
import { fetchRecipes } from '../services/Api'

const RecipeSearch = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        let dataobj = {
            query: "pasta",
            cuisine: "italian",
            intolerances: "sesame",
            diet: "vegan",
            excludeCuisine: "indian"
        };

        try {
            let data = await fetchRecipes(dataobj);
            setRecipes(data.results); // Adjust this line according to the API response structure
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleSearch}>Search Recipes</button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {recipes && recipes.map(recipe => (
                <div key={recipe.id}>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    {/* Render other recipe details as needed */}
                </div>
            ))}
        </div>
    );
};

export default RecipeSearch;