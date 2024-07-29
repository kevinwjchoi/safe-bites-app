import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username is too short')
    .max(25, 'Username is too long')
    .required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password is too short')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
    .required('Password is required'),
  allergies: Yup.string(),
  restrictions: Yup.string(),
});

const CustomTextField = ({ label, ...props }) => (
  <Field
    name={props.name}
    as={TextField}
    label={label}
    variant="outlined"
    margin="normal"
    fullWidth
    helperText={<ErrorMessage name={props.name} />}
    error={Boolean(props.touched && props.errors)}
    {...props}
  />
);

const SignupForm = ({ onSubmit }) => (
  <Formik
    initialValues={{
      username: '',
      email: '',
      password: '',
      allergies: '',
      restrictions: '',
    }}
    validationSchema={SignupSchema}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    }}
  >
    {({ handleSubmit, resetForm, errors, touched, isSubmitting }) => (
      <Form onSubmit={handleSubmit}>
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
          <CustomTextField
            name="username"
            label="Username"
            type="text"
            helperText={<ErrorMessage name="username" />}
            error={Boolean(touched.username && errors.username)}
          />
          <CustomTextField
            name="email"
            label="Email"
            type="email"
            helperText={<ErrorMessage name="email" />}
            error={Boolean(touched.email && errors.email)}
          />
          <CustomTextField
            name="password"
            label="Password"
            type="password"
            helperText={<ErrorMessage name="password" />}
            error={Boolean(touched.password && errors.password)}
          />
          <CustomTextField
            name="allergies"
            label="Allergies (optional)"
            type="text"
            helperText={<ErrorMessage name="allergies" />}
            error={Boolean(touched.allergies && errors.allergies)}
          />
          <CustomTextField
            name="restrictions"
            label="Restrictions (optional)"
            type="text"
            helperText={<ErrorMessage name="restrictions" />}
            error={Boolean(touched.restrictions && errors.restrictions)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: '100%' }}
            disabled={isSubmitting}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Button component={Link} to="/login" variant="text">
              Login
            </Button>
          </Typography>
        </Box>
      </Form>
    )}
  </Formik>
);

export default SignupForm;
