
export const fetchNearbyRestaurants = async (dataobj) => {
    const apiKey='r8aJAMfTwsYTipG_ma3yhN1PpqzQkzr3BQyaBFMoNaqNdZ-VksySigHdF12cTGUffLAGLFqfBKiUhhOM6KG0rrxSWJB3dN4E-kyoyPXZG4WmfBVE_zRXlKlVD-SuZnYx'
    const baseUrl = 'https://api.yelp.com/v3/businesses/search';
    console.log(apiKey)
    
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
    const apiKey = process.env.YELP_API_KEY || 'r8aJAMfTwsYTipG_ma3yhN1PpqzQkzr3BQyaBFMoNaqNdZ-VksySigHdF12cTGUffLAGLFqfBKiUhhOM6KG0rrxSWJB3dN4E-kyoyPXZG4WmfBVE_zRXlKlVD-SuZnYx';
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
