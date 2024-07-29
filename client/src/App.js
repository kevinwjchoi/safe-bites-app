import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Recipes from './pages/Recipes';
import Layout from './components/Layout';
import { lightTheme, darkTheme } from './styles/theme';
import { AppProvider } from './AppContext';

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
    <AppProvider>  {/* Use AppProvider instead of Redux Provider */}
      <ThemeProvider theme={theme}>
        <Router>
          <Layout onModeChange={handleModeChange}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/recipes" element={<Recipes />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
