import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, TextField, Snackbar, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useUserState, useUserDispatch } from '../UserContext';
import '../index.css';

const Profile = () => {
    const { user } = useUserState();
    const { updateUser, checkSession } = useUserDispatch();
    const [selectedSection, setSelectedSection] = useState('Personal Info');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [diet, setDiet] = useState('');
    const [intolerances, setIntolerances] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            await checkSession();
            setLoading(false);
        };
        fetchUser();
    }, [checkSession]);

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
        setIsEditing(false);
    };

    const handleChangePassword = () => {
        console.log('Change password clicked');
    };

    const formatArrayData = (data) => {
        if (!data || data.length === 0) {
            return 'None';
        }
        return Array.isArray(data) ? data.join(', ') : data;
    };

    const renderContent = () => {
        switch (selectedSection) {
            case 'Personal Info':
                return isEditing ? (
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
                    </>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom>Personal Info</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Username:</Typography>
                                <Typography variant="body1">{username}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Email:</Typography>
                                <Typography variant="body1">{email}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Diet:</Typography>
                                <Typography variant="body1">{formatArrayData(diet)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Intolerances:</Typography>
                                <Typography variant="body1">{formatArrayData(intolerances)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Cuisine:</Typography>
                                <Typography variant="body1">{formatArrayData(cuisine)}</Typography>
                            </Grid>
                        </Grid>
                        <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
                            Update Info
                        </Button>
                    </>
                );
            case 'Change Password':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>Change Password</Typography>
                        {/* Implement your password change form here */}
                    </>
                );
            case 'Saved Recipes':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>Saved Recipes</Typography>
                        {/* Implement saved recipes content here */}
                    </>
                );
            case 'Reviews':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>Reviews</Typography>
                        {/* Implement reviews content here */}
                    </>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user data available. Please log in.</div>;
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem', display: 'flex' }}>
            <Card style={{ minWidth: '250px', marginRight: '2rem' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Hi, {user.email}
                    </Typography>
                    <List>
                        <ListItem button onClick={() => { setSelectedSection('Personal Info'); setIsEditing(false); }}>
                            <ListItemText primary="Personal Info" />
                        </ListItem>
                        <ListItem button onClick={() => { setSelectedSection('Change Password'); setIsEditing(false); }}>
                            <ListItemText primary="Change Password" />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => { setSelectedSection('Saved Recipes'); setIsEditing(false); }}>
                            <ListItemText primary="Saved Recipes" />
                        </ListItem>
                        <ListItem button onClick={() => { setSelectedSection('Reviews'); setIsEditing(false); }}>
                            <ListItemText primary="Reviews" />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
            <Card variant="outlined" style={{ flexGrow: 1 }}>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                autoHideDuration={3000}
            />
        </Container>
    );
};

export default Profile;
