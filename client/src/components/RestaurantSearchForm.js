import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const RestaurantSearchForm = ({ handleSearch }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch({ query });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="query"
        label="Search Restaurants"
        name="query"
        autoComplete="query"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Search
      </Button>
    </Box>
  );
};

export default RestaurantSearchForm;
