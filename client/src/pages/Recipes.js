import React from 'react';
import { Typography, CircularProgress, List, ListItem } from '@mui/material';
import { useRecipeContext } from '../RecipeContext';
import RecipeSearchForm from '../components/RecipeSearchForm';

const Recipes = () => {
  const { recipes, status, error } = useRecipeContext();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Recipes
      </Typography>
      <RecipeSearchForm />
      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && (
        <Typography color="error">
          {typeof error === 'string' ? error : 'An unexpected error occurred.'}
        </Typography>
      )}
      {status === 'succeeded' && (
        <List>
          {recipes.map((recipe) => (
            <ListItem key={recipe.id}>
              {recipe.title ? recipe.title : 'Untitled Recipe'}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Recipes;
