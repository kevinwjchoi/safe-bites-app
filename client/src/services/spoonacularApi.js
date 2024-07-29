
import axios from 'axios';

const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
console.log('API Key:', API_KEY);

const BASE_URL = 'https://api.spoonacular.com';

const TEST_VARIABLE = process.env.REACT_APP_TEST_VARIABLE;
console.log('Test Variable:', TEST_VARIABLE); // Should print 'test_value'


export const fetchRecipesFromSpoonacular = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query: query,
        number: 2,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};


