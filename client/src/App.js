import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// Routes for my pages 
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails'

import Layout from './components/Layout';
import { lightTheme, darkTheme } from './styles/theme';
import { UserProvider } from './UserContext';
import { RecipeProvider } from './RecipeContext'; 
import { RestaurantProvider } from './RestaurantContext'; 

function App() {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'light';
    setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <UserProvider>
      <RecipeProvider>
        <RestaurantProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <Layout mode={mode} onModeChange={handleModeChange}>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipe/:id" element={<RecipeDetails />} />
                </Routes>
              </Layout>
            </Router>
          </ThemeProvider>
        </RestaurantProvider>
      </RecipeProvider>
    </UserProvider>
  );
}

export default App;