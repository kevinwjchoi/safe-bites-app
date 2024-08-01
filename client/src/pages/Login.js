import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useUserState, useUserDispatch } from '../UserContext';

const Login = () => {
  const { status, error } = useUserState();
  const { setUser, setStatus, setError } = useUserDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values, { resetForm }) => {
    setStatus('loading');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      resetForm();
      navigate('/home');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Login
        </Typography>

        {status === 'loading' && <CircularProgress sx={{ mt: 2 }} />}
        {status === 'failed' && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <LoginForm onSubmit={handleLogin} />
      </Paper>
    </Container>
  );
};

export default Login;