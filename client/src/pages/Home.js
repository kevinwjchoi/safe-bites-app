import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography } from '@mui/material';
import '../index.css'; 

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {currentUser ? currentUser.username : 'Guest'}
      </Typography>
      <Typography variant="body1" paragraph>
        {/* Add more content here if needed */}
      </Typography>
    </Container>
  );
};

export default Home;