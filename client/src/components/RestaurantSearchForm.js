import React from 'react';
import { TextField, Button, Typography, FormControl } from '@mui/material';
import { useRestaurantContext } from '../RestaurantContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const RestaurantSearchForm = ({ handleSearch }) => {
  const { getRestaurants } = useRestaurantContext();

  const initialValues = {
    location: 'new york',
    term: 'restaurant',
    categories: 'italian'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const dataobj = {
      location: values.location,
      term: values.term,
      categories: values.categories
    };
    await getRestaurants(dataobj);
    handleSearch();
    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <Typography variant="h6" gutterBottom>
            Search for Restaurants
          </Typography>
          
          <Field name="location">
            {({ field }) => (
              <FormControl fullWidth margin="normal">
                <TextField
                  {...field}
                  label="Search location"
                  variant="outlined"
                />
                <ErrorMessage name="location" component="div" style={{ color: 'red' }} />
              </FormControl>
            )}
          </Field>
          
          <Field name="term">
            {({ field }) => (
              <FormControl fullWidth margin="normal">
                <TextField
                  {...field}
                  label="Search term"
                  variant="outlined"
                />
                <ErrorMessage name="term" component="div" style={{ color: 'red' }} />
              </FormControl>
            )}
          </Field>
          
          <Field name="categories">
            {({ field }) => (
              <FormControl fullWidth margin="normal">
                <TextField
                  {...field}
                  label="Categories"
                  variant="outlined"
                />
                <ErrorMessage name="categories" component="div" style={{ color: 'red' }} />
              </FormControl>
            )}
          </Field>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Search
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RestaurantSearchForm;
