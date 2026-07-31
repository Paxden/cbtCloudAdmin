/**
 * App Text Field Component
 * Reusable text input with React Hook Form support
 */

import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const AppTextField = ({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  fullWidth = true,
  size = 'medium',
  rows,
  multiline = false,
  sx = {},
  helperText,
  error,
  ...props
}) => {
  // If control is provided, use React Hook Form Controller
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={label}
            type={type}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            InputProps={{
              readOnly,
            }}
            fullWidth={fullWidth}
            size={size}
            rows={rows}
            multiline={multiline}
            sx={sx}
            error={!!fieldState.error || !!error}
            helperText={fieldState.error?.message || helperText}
            {...props}
          />
        )}
      />
    );
  }

  // Standalone usage without React Hook Form
  return (
    <TextField
      name={name}
      label={label}
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      InputProps={{
        readOnly,
      }}
      fullWidth={fullWidth}
      size={size}
      rows={rows}
      multiline={multiline}
      sx={sx}
      error={!!error}
      helperText={helperText}
      {...props}
    />
  );
};

export default AppTextField;