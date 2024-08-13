import React, { useState, useEffect, useRef } from 'react';
import { Typography, CircularProgress, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecipeDetails } from '../services/spoonacularApi';
import { useReviewContext } from '../ReviewContext';
import { useUserState, useUserDispatch } from '../UserContext';
import RecipeReviewForm from '../components/RecipeReviewForm';
import DeleteIcon from '@mui/icons-material/Delete';

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUserState();
    const { checkSession } = useUserDispatch();
    const { reviews, fetchReviews, addReview, deleteReview, loading: reviewLoading, error: reviewError } = useReviewContext();

    const [recipe, setRecipe] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    // Ref to track if reviews have been fetched
    const reviewsFetched = useRef(false);

    // Fetch recipe details when component mounts or id changes
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await fetchRecipeDetails(id);
                setRecipe(data);
            } catch (err) {
                setLocalError(err.message);
            } finally {
                setLocalLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // Fetch reviews only when showReviews changes to true and if they haven't been fetched yet
    useEffect(() => {
        if (showReviews && !reviewsFetched.current) {
            const fetchReviewsData = async () => {
                try {
                    await fetchReviews(id);
                    reviewsFetched.current = true; // Mark reviews as fetched
                } catch (err) {
                    console.error('Error fetching reviews:', err.message);
                }
            };

            fetchReviewsData();
        }
    }, [showReviews, id, fetchReviews]);

    // Check session when the component mounts
    useEffect(() => {
        const checkUserSession = async () => {
            await checkSession();
        };

        checkUserSession();
    }, [checkSession]);

    const handleBackToRecipes = () => {
        navigate('/recipes');
    };

    const handleShowReviewForm = () => {
        setShowReviewForm(true);
    };

    const handleCloseReviewForm = () => {
        setShowReviewForm(false);
    };

    const handleReviewSubmit = async (values) => {
        const reviewData = {
            title: values.title,
            comment: values.comment,
            rating: parseFloat(values.rating),
        };

        try {
            await addReview(id, reviewData);
            handleCloseReviewForm();
            setShowReviews(true); // Show reviews after adding a new one
        } catch (error) {
            console.error('Error adding review:', error.message);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setShowReviews(true); // Refresh reviews after deletion
        } catch (error) {
            console.error('Error deleting review:', error.message);
        }
    };

    if (localLoading) return <CircularProgress />;
    if (localError) return <Typography color="error">{localError}</Typography>;
    if (!recipe) return <Typography>No recipe details found</Typography>;

    // Ensure reviews is an array
    const reviewList = Array.isArray(reviews) ? reviews : [];

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>{recipe.title}</Typography>
                    <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        style={{ width: '40%', height: 'auto', display: 'block', margin: '0 auto' }} 
                    />
                    <Typography variant="h6">Ingredients:</Typography>
                    <ul>
                        {recipe.extendedIngredients.map((ingredient, index) => (
                            <li key={ingredient.id || index}>{ingredient.original}</li>
                        ))}
                    </ul>
                    <Typography variant="h6">Instructions:</Typography>
                    <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBackToRecipes}
                        style={{ marginTop: '20px' }}
                    >
                        Back to results
                    </Button>
                    <br />
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={() => setShowReviews(prev => !prev)}
                        style={{ marginTop: '20px' }}
                    >
                        {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                    </Button>
                    {user && (
                        <Button 
                            variant="contained"
                            color="secondary"
                            onClick={handleShowReviewForm}
                            style={{ marginTop: '20px' }}
                        >
                            Add a review
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={showReviewForm}
                onClose={handleCloseReviewForm}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add a Review</DialogTitle>
                <DialogContent>
                    <RecipeReviewForm 
                        onSubmit={handleReviewSubmit}
                        onClose={handleCloseReviewForm}
                    />
                </DialogContent>
            </Dialog>

            {showReviews && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Reviews:</Typography>
                        {reviewLoading ? (
                            <CircularProgress />
                        ) : reviewError ? (
                            <Typography color="error">{reviewError}</Typography>
                        ) : reviewList.length === 0 ? (
                            <Typography>No reviews yet, be the first to leave a review!</Typography>
                        ) : (
                            <List>
                                {reviewList.map(review => (
                                    <ListItem key={review.id}>
                                        <ListItemText
                                            primary={review.title}
                                            secondary={`${review.comment} - Rating: ${review.rating}`}
                                        />
                                        {user && review.user_id === user.id && (
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleDeleteReview(review.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default RecipeDetails;
