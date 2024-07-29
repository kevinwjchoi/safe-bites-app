import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Drawer, List, ListItem, ListItemText, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';  // Import your context hook

const Layout = ({ children, onModeChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useAppContext();  // Use context to get dispatch

  const hideAppBarRoutes = ['/login', '/signup'];

  const shouldHideAppBar = hideAppBarRoutes.includes(location.pathname);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', { method: 'DELETE' });

      if (response.ok) {
        // Dispatch action to clear user state
        dispatch({ type: 'SET_USER', payload: null });

        navigate('/login');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return (
    <div className="background-container">
      {!shouldHideAppBar && (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component={Link} to="/home" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
              SafeBites
            </Typography>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
            <Switch onChange={onModeChange} />
          </Toolbar>
        </AppBar>
      )}
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <List>
          <ListItem component={Link} to="/restaurants" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="Restaurants" />
          </ListItem>
          <ListItem component={Link} to="/recipes" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="Recipes" />
          </ListItem>
        </List>
      </Drawer>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
