export const handleViewDetails = async (id, checkSession, user, navigate) => {
    // Check if user is authenticated
    const isAuthenticated = await checkSession();
    if (!isAuthenticated || !user || !user.id) {
      console.error('User not authenticated or user data is missing');
      return;
    }
  
    // Fetch restaurant details from the API
    try {
      const response = await fetch(`/restaurant/${id}`); // Replace with your API endpoint
      const restaurant = await response.json();
  
      // Check if restaurant exists
      if (!restaurant) {
        console.error('Restaurant not found');
        return;
      }
  
      // Save the restaurant data to the backend
      const saveResponse = await fetch('/save_yelp_restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...restaurant, user_id: user.id }),  // Include user ID to track who saved it
      });
  
      if (saveResponse.ok) {
        console.log('Restaurant saved successfully!');
      } else {
        console.error('Failed to save restaurant:', await saveResponse.text());
      }
  
      // Navigate to the restaurant details page with the restaurant data
      navigate(`/restaurant/${id}`, { state: { restaurant } });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  