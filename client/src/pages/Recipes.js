import React, { useState } from 'react';
import { Typography, CircularProgress, List, ListItem, Button, Card, CardContent, CardMedia } from '@mui/material';
import { useRecipeContext } from '../RecipeContext';
import RecipeSearchForm from '../components/RecipeSearchForm';
import RecipeDetails from '../components/RecipeDetails'; 

const Recipes = () => {
  const { recipes, status, error } = useRecipeContext();
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const handleRecipeClick = (id) => {
    setSelectedRecipeId(id);
  };

  const handleBackClick = () => {
    setSelectedRecipeId(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Recipes
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => setShowSearchForm(prev => !prev)}
      >
        {showSearchForm ? 'Hide Search Form' : 'Show Search Form'}
      </Button>
      
      {showSearchForm && <RecipeSearchForm />}
      
      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && (
        <Typography color="error">
          {typeof error === 'string' ? error : 'An unexpected error occurred.'}
        </Typography>
      )}
      {status === 'succeeded' && !selectedRecipeId && (
        <List>
          {recipes.map((recipe) => (
            <ListItem key={recipe.id} button onClick={() => handleRecipeClick(recipe.id)}>
              <Card>
                <CardMedia
                  component="img"
                  image={recipe.image}
                  alt={recipe.title}
                />
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                </CardContent>
              </Card>
            </ListItem> 
          ))}
        </List>
      )}
      
      {selectedRecipeId && (
        <div>
          <Button variant="contained" onClick={handleBackClick}>
            Back to Recipes
          </Button>
          <RecipeDetails id={selectedRecipeId} />
        </div>
      )}
    </div>
  );
};

export default Recipes;
