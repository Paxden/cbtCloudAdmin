/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * App Search Field Component
 * Reusable search input with debounce
 */

import { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const AppSearchField = ({
  value,
  onChange,
  placeholder = 'Search...',
  debounceDelay = 300,
  fullWidth = true,
  size = 'small',
  disabled = false,
  sx = {},
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(internalValue);
      }
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [internalValue, debounceDelay, onChange]);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value || '');
    }
  }, [value]);

  const handleClear = () => {
    setInternalValue('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <TextField
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      sx={sx}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: internalValue && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} edge="end">
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default AppSearchField;