import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Field, ErrorMessage } from 'formik';

const CustomSelect = ({ label, name, options, value, onChange }) => (
  <FormControl fullWidth margin="normal">
    <InputLabel>{label}</InputLabel>
    <Field name={name}>
      {({ field, form }) => (
        <Select
          multiple
          value={value}
          onChange={(event) => onChange(event.target.value)}
          renderValue={(selected) => selected.join(', ')}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={value.includes(option)} />
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
