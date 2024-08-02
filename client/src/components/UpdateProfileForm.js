import React, { useState, useEffect } from 'react';
import { Typography, Grid, TextField, Button, Snackbar } from '@mui/material';
import { useUserState, useUserDispatch } from '../UserContext';

const UpdateProfileInfoForm = ({ onClose }) => {
    const { user } = useUserState();
    const { updateUser } = useUserDispatch();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [diet, setDiet] = useState('');
    const [intolerances, setIntolerances] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setDiet(user.diet || '');
            setIntolerances(user.intolerances || '');
            setCuisine(user.cuisine || '');
        }
    }, [user]);

    const handleSave = () => {
        updateUser({ username, email, diet, intolerances, cuisine });
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarOpen(true);
        onClose();
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Personal Info</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Username:</Typography>
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Email:</Typography>
                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Diet:</Typography>
                    <TextField
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Intolerances:</Typography>
                    <TextField
                        value={intolerances}
                        onChange={(e) => setIntolerances(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Cuisine:</Typography>
                    <TextField
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                Save Changes
            </Button>
            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                autoHideDuration={3000}
            />
        </>
    );
};

export default UpdateProfileInfoForm;
