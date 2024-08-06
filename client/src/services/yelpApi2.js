const BASE_URL = 'https://api.yelp.com/v3/businesses/search';


async function fetchNearbyRestaurants(location, term = 'restaurant', categories = '') {
    const url = new URL(BASE_URL);
    const headers = {
        'Authorization': `Bearer YOUR_YELP_API_KEY`, // Replace YOUR_YELP_API_KEY with your actual API key
        'Content-Type': 'application/json',
    };

    const params = {
        location: location,
        term: term,
        categories: categories,
        limit: 10, // Adjust as necessary
    };

    try {
        const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export { fetchNearbyRestaurants };
