import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Card, CardContent, CardMedia, Button } from '@mui/material';
import { fetchRecipeDetails } from '../services/spoonacularApi';

const RecipeDetails = ({ id }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await fetchRecipeDetails(id);
        setRecipe(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      {recipe && (
        <>
          <CardMedia
            component="img"
            image={recipe.image}
            alt={recipe.title}
          />
          <CardContent>
            <Typography variant="h4">{recipe.title}</Typography>
            <Typography variant="body1">{recipe.summary}</Typography>
            <Typography variant="h6">Instructions:</Typography>
            <Typography variant="body2">{recipe.instructions}</Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default RecipeDetails;
