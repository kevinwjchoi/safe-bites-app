// src/pages/Home.js
import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useUserState, useUserDispatch } from '../UserContext';
import { RestaurantCarousel } from '../components/RestaurantCarousel';
import { ViewedRestaurantCarousel } from '../components/ViewedRestaurantCarousel';
import '../index.css'; 

const Home = () => {
  const { user } = useUserState();
  const { setUser, setStatus, setError } = useUserDispatch();



  const capFirstLetter = (string) => 
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();


  return (
    <Container sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user ? capFirstLetter(user.username) : 'Guest'}
      </Typography>
      <Typography variant="body1" paragraph>
        <h2>Glance at your favorite restaurants</h2>
        <RestaurantCarousel />
      </Typography>
      <Typography>
        <h2>See what others are looking at</h2>
        <ViewedRestaurantCarousel />
      </Typography>
    </Container>
  );
};

export default Home;
