import React, {useEffect} from 'react';
import { Typography, CircularProgress, Button } from '@mui/material';
import { useRestaurantContext } from '../RestaurantContext';
import RestaurantSearchForm from '../components/RestaurantSearchForm';
import RestaurantCards from '../components/RestaurantCards';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useUserState, useUserDispatch } from '../UserContext'; // Import custom hooks
import { fetchRestaurantDetails } from '../services/yelpApi'

const Restaurants = () => {
  const theme = useTheme();
  const { restaurants, status, error, showForm, setShowForm, resetState } = useRestaurantContext();
  const navigate = useNavigate();
  const { user, status: userStatus } = useUserState(); // Get user data
  const { checkSession } = useUserDispatch(); // Get dispatch functions

  useEffect(() => {
    // Check user session on component mount
    const verifySession = async () => {
      await checkSession();
    };
    verifySession();
  }, [checkSession]);
    
  
  const handleViewDetails = async (id) => {
    // Check if user is authenticated
    const isAuthenticated = await checkSession();
    if (!isAuthenticated || !user || !user.id) {
      console.error('User not authenticated or user data is missing');
      return;
    }
  
    // Fetch restaurant details from the API
    try {
      const restaurant = await fetchRestaurantDetails(id);
  
      // Check if restaurant exists
      if (!restaurant) {
        console.error('Restaurant not found');
        return;
      }
  
      // Save the restaurant data to the backend
      const saveResponse = await fetch('/save_yelp_restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...restaurant, user_id: user.id }),  // Include user ID to track who saved it
      });
  
      if (saveResponse.ok) {
        console.log('Restaurant saved successfully!');
      } else {
        console.error('Failed to save restaurant:', await saveResponse.text());
      }
  
      // Navigate to the restaurant details page with the restaurant data
      navigate(`/restaurant/${id}`, { state: { restaurant } });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleBackToRestaurants = () => {
    resetState();
    navigate('/restaurants');
  };

  const handleSearch = () => {
    setShowForm(false);
  };

  const handleFavorite = async (id) => {

        // Check if user is authenticated
    const isAuthenticated = await checkSession();
    if (!isAuthenticated || !user || !user.id) {
      console.error('User not authenticated or user data is missing');
      return;
    }
  
    try {
      const restaurant = await fetchRestaurantDetails(id)
  
      if (!restaurant) {
        console.error('Restaurant not found');
        return;
      }

      const saveResponse = await fetch('/favorite_restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...restaurant, user_id: user.id }),  // Include user ID to track who saved it
      });

      if (saveResponse.ok) {
        console.log('Restaurant favorited successfully!');
      } else {
        console.error('Failed to favorite restaurant:', await saveResponse.text());
      }

    } catch (error) {
      console.error('Error:', error);
    }
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
            <RestaurantCards restaurants={restaurants} handleViewDetails={handleViewDetails} handleFavorite={handleFavorite} />
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
