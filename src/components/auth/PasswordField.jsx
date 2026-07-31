/**
 * Password Field Component
 * Reusable password input with visibility toggle
 */

import { useState } from 'react';
import {
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  disabled,
  required,
  fullWidth = true,
  autoComplete = 'current-password',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label || 'Password'}
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={value || ''} // ✅ Ensure value is always a string
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePassword}
              edge="end"
              disabled={disabled}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;