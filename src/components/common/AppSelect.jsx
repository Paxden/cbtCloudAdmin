/**
 * App Select Component
 * Reusable select dropdown with React Hook Form support
 */

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

const AppSelect = ({
  name,
  control,
  label,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  size = "medium",
  sx = {},
  helperText,
  error,
  ...props
}) => {
  const renderSelect = (field, fieldState) => (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={!!fieldState?.error || !!error}
      disabled={disabled}
      required={required}
      sx={sx}
    >
      <InputLabel>{label}</InputLabel>
      <Select {...field} label={label} displayEmpty {...props}>
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(fieldState?.error?.message || helperText) && (
        <FormHelperText>
          {fieldState?.error?.message || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );

  // If control is provided, use React Hook Form Controller
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => renderSelect(field, fieldState)}
      />
    );
  }

  // Standalone usage without React Hook Form
  return renderSelect({ value: props.value || "", onChange: props.onChange });
};

export default AppSelect;
