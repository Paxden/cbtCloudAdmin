/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Password Field Component
 * Reusable password input with visibility toggle and strength indicator
 * 
 * Key Improvements:
 * - Password strength indicator
 * - Caps lock detection
 * - Better accessibility
 * - Smooth toggle animation
 * - Professional styling
 */

import { useState, useEffect, useRef } from 'react';
import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
  LinearProgress,
  Typography,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const PasswordField = ({
  label,
  name,
  value = '',
  onChange,
  error,
  helperText,
  disabled,
  required,
  fullWidth = true,
  autoComplete = 'current-password',
  showStrength = false,
  placeholder = 'Enter your password',
  ...props
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  const inputRef = useRef(null);

  // Calculate password strength
  useEffect(() => {
    if (!value || !showStrength) {
      setStrength(0);
      setStrengthLabel('');
      return;
    }

    let score = 0;
    const password = value.toString();

    // Length check
    if (password.length >= 8) score += 25;
    else if (password.length >= 6) score += 15;

    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 20;

    // Contains lowercase
    if (/[a-z]/.test(password)) score += 20;

    // Contains numbers
    if (/\d/.test(password)) score += 20;

    // Contains special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;

    // Bonus for length > 12
    if (password.length > 12) score += 10;

    // Cap at 100
    const finalScore = Math.min(score, 100);
    setStrength(finalScore);

    // Set label
    if (finalScore >= 80) setStrengthLabel('Strong');
    else if (finalScore >= 60) setStrengthLabel('Good');
    else if (finalScore >= 40) setStrengthLabel('Fair');
    else if (finalScore >= 20) setStrengthLabel('Weak');
    else setStrengthLabel('Very Weak');
  }, [value, showStrength]);

  // Get strength color
  const getStrengthColor = () => {
    if (strength >= 80) return 'success.main';
    if (strength >= 60) return 'info.main';
    if (strength >= 40) return 'warning.main';
    if (strength >= 20) return 'warning.dark';
    return 'error.main';
  };

  // Get strength icon
  const getStrengthIcon = () => {
    if (strength >= 80) return <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />;
    if (strength >= 60) return <CheckIcon sx={{ fontSize: 16, color: 'info.main' }} />;
    if (strength >= 40) return <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
    return <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />;
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Detect caps lock
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        label={label || 'Password'}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value || ''}
        onChange={onChange}
        error={!!error}
        helperText={helperText}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputRef={inputRef}
        onKeyDown={handleKeyDown}
        {...props}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {/* Caps Lock Indicator */}
              {capsLockOn && (
                <Tooltip title="Caps Lock is on">
                  <Box
                    component="span"
                    sx={{
                      mr: 0.5,
                      color: 'warning.main',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    Caps
                  </Box>
                </Tooltip>
              )}
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                disabled={disabled}
                sx={{
                  transition: 'transform 0.2s',
                  '&:active': {
                    transform: 'scale(0.9)',
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Password Strength Indicator */}
      {showStrength && value && value.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={strength}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.grey[300], 0.5),
                '& .MuiLinearProgress-bar': {
                  bgcolor: getStrengthColor(),
                  borderRadius: 2,
                  transition: 'background-color 0.3s',
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getStrengthIcon()}
              <Typography
                variant="caption"
                sx={{
                  color: getStrengthColor(),
                  fontWeight: 500,
                  fontSize: '0.65rem',
                }}
              >
                {strengthLabel}
              </Typography>
            </Box>
          </Box>

          {/* Password Requirements */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {[
              { label: '8+ characters', test: value.length >= 8 },
              { label: 'Uppercase', test: /[A-Z]/.test(value) },
              { label: 'Lowercase', test: /[a-z]/.test(value) },
              { label: 'Number', test: /\d/.test(value) },
              { label: 'Special char', test: /[!@#$%^&*(),.?":{}|<>]/.test(value) },
            ].map((req) => (
              <Box
                key={req.label}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.25,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  bgcolor: req.test ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.grey[400], 0.08),
                  color: req.test ? 'success.main' : 'text.disabled',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                }}
              >
                {req.test ? (
                  <CheckIcon sx={{ fontSize: 12 }} />
                ) : (
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid', borderColor: 'text.disabled' }} />
                )}
                {req.label}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PasswordField;