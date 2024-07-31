import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

const CustomSelect = ({ label, name, options }) => (
  <FormControl fullWidth margin="normal">
    <InputLabel>{label}</InputLabel>
    <Field name={name}>
      {({ field, form }) => (
        <Select
          {...field}
          multiple
          renderValue={(selected) => selected.join(', ')}
          onChange={(event) => form.setFieldValue(name, event.target.value)}
          value={field.value}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={field.value.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      )}
    </Field>
    <ErrorMessage name={name} component="div" style={{ color: 'red' }} />
  </FormControl>
);

export default CustomSelect;
