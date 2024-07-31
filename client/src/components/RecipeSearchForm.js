import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import { useRecipeContext } from '../RecipeContext'

const cuisines = [
  'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 
  'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 
  'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 
  'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 
  'Spanish', 'Thai', 'Vietnamese'
];

const availableIntolerances = [
  'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 
  'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
];

const RecipeSearchForm = () => {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [intolerances, setIntolerances] = useState([]);
  const [diet, setDiet] = useState('');
  const [excludeCuisine, setExcludeCuisine] = useState('');
  const { getRecipes, recipes, loading, error } = useRecipeContext();

  const handleSearchChange = (event) => setQuery(event.target.value);
  const handleCuisineChange = (event) => setCuisine(event.target.value);
  const handleIntolerancesChange = (event) => setIntolerances(event.target.value);
  const handleDietChange = (event) => setDiet(event.target.value);
  const handleExcludeCuisineChange = (event) => setExcludeCuisine(event.target.value);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const dataobj = {
      query,
      cuisine,
      intolerances: intolerances.join(','),
      diet,
      excludeCuisine
    };
    getRecipes(dataobj);
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <Typography variant="h6" gutterBottom>
          Search for Recipes
        </Typography>
        <TextField
          label="Search query"
          variant="outlined"
          value={query}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Cuisine</InputLabel>
          <Select
            value={cuisine}
            onChange={handleCuisineChange}
            label="Cuisine"
          >
            {cuisines.map((cuisineOption) => (
              <MenuItem key={cuisineOption} value={cuisineOption}>
                {cuisineOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Intolerances</InputLabel>
          <Select
            multiple
            value={intolerances}
            onChange={handleIntolerancesChange}
            renderValue={(selected) => selected.join(', ')}
            label="Intolerances"
          >
            {availableIntolerances.map((intolerance) => (
              <MenuItem key={intolerance} value={intolerance}>
                {intolerance}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Diet"
          variant="outlined"
          value={diet}
          onChange={handleDietChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Exclude Cuisine"
          variant="outlined"
          value={excludeCuisine}
          onChange={handleExcludeCuisineChange}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
      <div>
        {loading && <Typography variant="body1" gutterBottom>Loading...</Typography>}
        {error && <Typography variant="body1" color="error" gutterBottom>{error}</Typography>}
        {recipes.length > 0 ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Recipe Results
            </Typography>
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id}>{recipe.title}</li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && <Typography variant="body1" gutterBottom>No recipes found.</Typography>
        )}
      </div>
    </div>
  );
};

export default RecipeSearchForm;
