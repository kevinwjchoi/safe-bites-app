import React from 'react';
import { Typography, CircularProgress, Button } from '@mui/material';
import { useRestaurantState, useRestaurantDispatch } from '../RestaurantContext';
import RestaurantSearchForm from '../components/RestaurantSearchForm';
import RestaurantCards from '../components/RestaurantCards';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Restaurants = () => {
  const theme = useTheme();
  const { restaurants, status, error } = useRestaurantState();
  const { fetchRestaurants } = useRestaurantDispatch();
  const [showForm, setShowForm] = React.useState(true);
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const handleBackToRestaurants = () => {
    setShowForm(true);
    fetchRestaurants(); // You can adjust this call based on your reset logic
  };

  const handleSearch = (dataobj) => {
    setShowForm(false);
    fetchRestaurants(dataobj);
  };

  return (
    <div>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ color: theme.palette.text.primary }} // Use theme color
      >
        Restaurants
      </Typography>
      {showForm && <RestaurantSearchForm handleSearch={handleSearch} />}
      {!showForm && (
        <>
          {status === 'loading' && <CircularProgress />}
          {status === 'failed' && (
            <Typography color="error">
              {typeof error === 'string' ? error : 'An unexpected error occurred.'}
            </Typography>
          )}
          {status === 'succeeded' && restaurants.length > 0 && (
            <RestaurantCards restaurants={restaurants} handleViewDetails={handleViewDetails} />
          )}
          {status === 'succeeded' && restaurants.length === 0 && (
            <Typography variant="body1">No restaurants found.</Typography>
          )}
        </>
      )}
      {!showForm && restaurants.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToRestaurants}
          style={{ marginTop: '20px' }}
        >
          New search
        </Button>
      )}
    </div>
  );
};

export default Restaurants;
