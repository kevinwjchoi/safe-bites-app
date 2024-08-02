// src/pages/Home.js
import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useUserState, useUserDispatch } from '../UserContext';
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
        {/* Add more content here if needed */}
      </Typography>
    </Container>
  );
};

export default Home;
