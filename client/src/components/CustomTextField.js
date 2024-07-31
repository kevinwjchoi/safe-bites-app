import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextField } from '@mui/material';

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

export default CustomTextField;
