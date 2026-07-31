/**
 * Password Change Form Component
 * Form for changing user password
 */

import { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import PasswordField from '../auth/PasswordField';

const PasswordChangeForm = ({ onSubmit, loading, error, success }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  const handleClear = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setValidationErrors({});
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: '#d32f2f' },
      { label: 'Weak', color: '#ed6c02' },
      { label: 'Fair', color: '#ed6c02' },
      { label: 'Good', color: '#2e7d32' },
      { label: 'Strong', color: '#2e7d32' },
      { label: 'Very Strong', color: '#2e7d32' },
    ];

    return levels[Math.min(score, 5)];
  };

  const strength = getPasswordStrength(formData.newPassword);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Change Password
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Ensure your account is secure with a strong password
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password changed successfully! You will be logged out in a moment.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <PasswordField
            label="Current Password"
            value={formData.currentPassword}
            onChange={handleChange('currentPassword')}
            disabled={loading}
            error={validationErrors.currentPassword}
            helperText={validationErrors.currentPassword}
            autoComplete="current-password"
          />

          <Divider />

          <PasswordField
            label="New Password"
            value={formData.newPassword}
            onChange={handleChange('newPassword')}
            disabled={loading}
            error={validationErrors.newPassword}
            helperText={validationErrors.newPassword || 'Min 8 characters with uppercase, lowercase, and number'}
            autoComplete="new-password"
          />

          {formData.newPassword && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Password Strength:{' '}
                <span style={{ color: strength.color, fontWeight: 600 }}>
                  {strength.label}
                </span>
              </Typography>
              <Box
                sx={{
                  height: 4,
                  width: '100%',
                  bgcolor: '#e0e0e0',
                  borderRadius: 2,
                  mt: 0.5,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${Math.min((formData.newPassword.length / 20) * 100, 100)}%`,
                    bgcolor: strength.color,
                    borderRadius: 2,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
            </Box>
          )}

          <PasswordField
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            disabled={loading}
            error={validationErrors.confirmPassword}
            helperText={validationErrors.confirmPassword}
            autoComplete="new-password"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
              disabled={loading || success}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
            <Button variant="outlined" onClick={handleClear} disabled={loading}>
              Clear
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default PasswordChangeForm;