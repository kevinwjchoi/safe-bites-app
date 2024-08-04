const apiKey = process.env.REACT_APP_YELP_API_KEY;

const baseUrl = "https://api.yelp.com/v3/businesses/search";

// Function to fetch nearby restaurants
export const fetchNearbyRestaurants = async (dataobj) => {
  const url = new URL(baseUrl);
  url.search = new URLSearchParams({
      location: dataobj.location,
      term: dataobj.term || 'restaurant',
      categories: dataobj.categories,
      limit: dataobj.limit || 10,
  }).toString();

  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
          }
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};

// Function to fetch detailed information about a single restaurant
export const fetchRestaurantDetails = async (restaurantId) => {
  const url = `https://api.yelp.com/v3/businesses/${restaurantId}`;

  try {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    throw error;
  }
};

// Fetch details for all restaurants
export const fetchAllRestaurantDetails = async (restaurants) => {
  try {
    const detailsPromises = restaurants.map(restaurant => fetchRestaurantDetails(restaurant.id));
    const detailedRestaurants = await Promise.all(detailsPromises);
    return detailedRestaurants;
  } catch (error) {
    console.error('Error fetching all restaurant details:', error);
    throw error;
  }
};

// Example usage: Fetch detailed restaurants after getting basic restaurants
export const getDetailedRestaurants = async (dataobj) => {
  try {
    const basicRestaurants = await fetchNearbyRestaurants(dataobj);
    const detailedRestaurants = await fetchAllRestaurantDetails(basicRestaurants.businesses);
    return detailedRestaurants;
  } catch (error) {
    console.error('Error getting detailed restaurants:', error);
    throw error;
  }
};

// Function to fetch basic restaurants by query
export const fetchBasicRestaurants = async (query) => {
  const url = new URL(baseUrl);
  url.search = new URLSearchParams({
      term: query,
      apiKey: apiKey
  }).toString();

  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
          }
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};
