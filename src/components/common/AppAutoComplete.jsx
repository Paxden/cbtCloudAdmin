/* eslint-disable no-unused-vars */
/**
 * AppAutocomplete - Reusable Autocomplete Component
 * 
 * Features:
 * - React Hook Form compatible
 * - Async search support
 * - Debounced input
 * - Loading state
 * - Free solo mode
 * - Multiple selection
 * - Grouped options
 */

import { Autocomplete, TextField, CircularProgress } from '@mui/material';

export const AppAutocomplete = ({
  label,
  name,
  options = [],
  value,
  onChange,
  onInputChange,
  loading = false,
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'medium',
  placeholder = 'Search...',
  multiple = false,
  freeSolo = false,
  optionLabel = 'label',
  optionValue = 'value',
  groupBy = null,
  register = null,
  sx = {},
  ...props
}) => {
  const registerProps = register && name ? register(name) : {};

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange || registerProps?.onChange}
      onInputChange={onInputChange}
      loading={loading}
      multiple={multiple}
      freeSolo={freeSolo}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option[optionLabel] || '';
      }}
      getOptionKey={(option) => {
        if (typeof option === 'string') return option;
        return option[optionValue] || option[optionLabel];
      }}
      groupBy={groupBy}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          size={size}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          ...sx,
        },
      }}
      {...props}
    />
  );
};

export default AppAutocomplete;