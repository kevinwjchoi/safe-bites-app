import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecipeDetails } from '../services/spoonacularApi';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchRecipeDetails(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleBackToRecipes = () => {
    navigate('/recipes');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!recipe) return <Typography>No recipe details found</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>{recipe.title}</Typography>
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          style={{ width: '40%', height: 'auto', display: 'block', margin: '0 auto' }} 
        />
        <Typography variant="h6">Ingredients:</Typography>
        <ul>
          {recipe.extendedIngredients.map((ingredient) => (
            <li key={ingredient.id}>{ingredient.original}</li>
          ))}
        </ul>
        <Typography variant="h6">Instructions:</Typography>
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToRecipes}
          style={{ marginTop: '20px' }}
        >
          Back to results
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeDetails;
