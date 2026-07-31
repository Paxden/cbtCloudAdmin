/**
 * Forgot Password Form Component
 * Forgot password form with validation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, TextField, Button, Alert, CircularProgress, Link, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    clearError();
    const result = await forgotPassword(data.email);

    if (result?.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset link has been sent to your email address.
        </Alert>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/login')}
        >
          Return to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            fullWidth
            required
            disabled={isLoading}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
            autoComplete="email"
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{ py: 1.5, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Send Reset Link'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Link href="/login" variant="body2" sx={{ cursor: 'pointer', textDecoration: 'none' }}>
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;