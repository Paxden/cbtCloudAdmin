/* eslint-disable react-hooks/incompatible-library */
/**
 * Change Password Form Component
 * Change password form with validation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, Alert, CircularProgress, Typography } from '@mui/material';
import PasswordField from './PasswordField';
import { useAuth } from '../../hooks/useAuth';

// Validation schema
const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .notOneOf([yup.ref('currentPassword')], 'New password must be different from current password')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ChangePasswordForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { changePassword, isLoading, error, clearError } = useAuth();
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    clearError();
    const result = await changePassword({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    if (result?.success) {
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  if (success) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Password has been changed successfully.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

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

  const strength = getPasswordStrength(newPassword);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Controller
        name="currentPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            {...field}
            label="Current Password"
            disabled={isLoading}
            error={errors.currentPassword}
            helperText={errors.currentPassword?.message}
            sx={{ mb: 2 }}
            autoComplete="current-password"
          />
        )}
      />

      <Controller
        name="newPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            {...field}
            label="New Password"
            disabled={isLoading}
            error={errors.newPassword}
            helperText={errors.newPassword?.message}
            sx={{ mb: 1 }}
            autoComplete="new-password"
          />
        )}
      />

      {newPassword && (
        <Box sx={{ mb: 2 }}>
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
                width: `${Math.min((newPassword.length / 20) * 100, 100)}%`,
                bgcolor: strength.color,
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>
      )}

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            {...field}
            label="Confirm New Password"
            disabled={isLoading}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ mb: 2 }}
            autoComplete="new-password"
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{ py: 1.5 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Change Password'}
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;