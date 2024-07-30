import React, { useState } from 'react';
import { useRecipeContext } from '../RecipeContext';
import { TextField, Button, CircularProgress, Typography, List, ListItem } from '@mui/material';

const Recipes = () => {
  const [query, setQuery] = useState('');
  const { recipes, status, error, fetchRecipes } = useRecipeContext();

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      fetchRecipes(query);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Recipes
      </Typography>
      <form onSubmit={handleSearchSubmit}>
        <TextField
          label="Search for recipes"
          variant="outlined"
          value={query}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Search
        </Button>
      </form>
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
