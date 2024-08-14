import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Snackbar, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useUserState } from '../UserContext';
import { useReviewContext } from '../ReviewContext';
import UpdateProfileInfoForm from '../components/UpdateProfileInfoForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import RecipeReviewEditForm from '../components/RecipeReviewEditForm';
import RecipeReviewCard from '../components/RecipeReviewCard';
import '../index.css';

const Profile = () => {
    const { user } = useUserState();
    const [selectedSection, setSelectedSection] = useState('Personal Info');
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { reviews, fetchReviews, addReview, deleteReview, editReview, loading: reviewLoading, error: reviewError } = useReviewContext();


    useEffect(() => {
        const fetchUser = async () => {
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const handleProfileUpdate = async (values) => {

        try {
            // Simulate an API call or update logic
            console.log('Updated profile with values:', values);
            // Show success message
            setSnackbarMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            // Show error message
            setSnackbarMessage('Failed to update profile.');
        }
        setSnackbarOpen(true);
    };

    

    const renderContent = () => {
        switch (selectedSection) {
            case 'Personal Info':
                return <UpdateProfileInfoForm
                onSubmit={handleProfileUpdate}
                initialValues={{
                  username: user.username,
                  email: user.email,
                  diet: user.diet || [],
                  intolerance: user.intolerance || [],
                  cuisine: user.cuisine || []
                }}
              />;
            case 'Change Password':
                return <ChangePasswordForm onClose={() => setSelectedSection('Change Password')} />;
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
                        <ListItem button onClick={() => setSelectedSection('Personal Info')}>
                            <ListItemText primary="Personal Info" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedSection('Change Password')}>
                            <ListItemText primary="Change Password" />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => setSelectedSection('Saved Recipes')}>
                            <ListItemText primary="Saved Recipes" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedSection('Reviews')}>
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
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                autoHideDuration={3000}
            />
        </Container>
    );
};

export default Profile;
