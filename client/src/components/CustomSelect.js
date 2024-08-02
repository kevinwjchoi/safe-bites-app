import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, useTheme } from '@mui/material';
import { Field, ErrorMessage } from 'formik';

const CustomSelect = ({ label, name, options }) => {
  const theme = useTheme(); // Get the theme object

  return (
    <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }}>
      <InputLabel id={`${name}-label`}>
        {label}
      </InputLabel>
      <Field name={name}>
        {({ field, form }) => (
          <Select
            multiple
            labelId={`${name}-label`}
            id={name}
            label={label}
            value={field.value || []}
            onChange={(event) => form.setFieldValue(name, event.target.value)}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500, 
                },
              },
            }}
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
};

export default CustomSelect;
















// import React from 'react';
// import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
// import { Field, ErrorMessage } from 'formik';

// const CustomSelect = ({ label, name, options, value, onChange }) => (
//   <FormControl fullWidth margin="normal">
//     <InputLabel>{label}</InputLabel>
//     <Field name={name}>
//       {({ field, form }) => (
//         <Select
//           multiple
//           value={value}
//           onChange={(event) => onChange(event.target.value)}
//           renderValue={(selected) => selected.join(', ')}
//         >
//           {options.map((option) => (
//             <MenuItem key={option} value={option}>
//               <Checkbox checked={value.includes(option)} />
//               <ListItemText primary={option} />
//             </MenuItem>
//           ))}
//         </Select>
//       )}
//     </Field>
//     <ErrorMessage name={name} component="div" style={{ color: 'red' }} />
//   </FormControl>
// );

// export default CustomSelect;
