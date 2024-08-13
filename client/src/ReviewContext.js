import React, { createContext, useState, useContext } from 'react';

// Create ReviewContext
const ReviewContext = createContext();

// Provider component
export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true); // Manage the visibility of the review form

  const fetchReviews = async (recipeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/recipe_reviews/${recipeId}`);
      const data = await response.json();
      setReviews(data);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (id, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/create_review/recipe/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const newReview = await response.json();
      setReviews(prevReviews => [...prevReviews, newReview.review]);
      setShowForm(false); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('this works')
    }
  };

  const deleteReview = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/delete_review/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }
      // Remove the deleted review from the state
      setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset state
  const resetState = () => {
    setReviews([]);
    setError(null);
    setShowForm(true);
  };

  return (
    <ReviewContext.Provider value={{ reviews, fetchReviews, addReview, deleteReview, loading, error, showForm, setShowForm, resetState }}>
      {children}
    </ReviewContext.Provider>
  );
};

// Custom hook to use the ReviewContext
export const useReviewContext = () => {
  return useContext(ReviewContext);
};
