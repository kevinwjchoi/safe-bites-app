
export const fetchNearbyRestaurants = async (dataobj) => {
    const apiKey = process.env.REACT_APP_YELP_API_KEY;
    const baseUrl = 'https://api.yelp.com/v3/businesses/search';
    
    const url = new URL(baseUrl);
    url.search = new URLSearchParams({
        location: dataobj.location,
        term: dataobj.term,
        categories: dataobj.categories,
        limit: 10,
        apiKey: apiKey
    }).toString();

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

};

export const fetchRestaurantDetails = async (id) => {
    const apiKey = process.env.REACT_APP_YELP_API_KEY;
    const baseUrl = `https://api.yelp.com/v3/businesses/${id}`;
  
    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };