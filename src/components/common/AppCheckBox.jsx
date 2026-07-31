/**
 * App Checkbox Component
 * Reusable checkbox with React Hook Form support
 */

import { FormControlLabel, Checkbox } from '@mui/material';
import { Controller } from 'react-hook-form';

const AppCheckbox = ({
  name,
  control,
  label,
  disabled = false,
  required = false,
  sx = {},
  ...props
}) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value || false}
                disabled={disabled}
                required={required}
                {...props}
              />
            }
            label={label}
            sx={sx}
          />
        )}
      />
    );
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          disabled={disabled}
          required={required}
          {...props}
        />
      }
      label={label}
      sx={sx}
    />
  );
};

export default AppCheckbox;