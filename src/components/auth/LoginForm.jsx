/**
 * Login Form Component
 * Login form with validation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Typography,
  Divider,
} from '@mui/material';
import PasswordField from './PasswordField';
import RememberMeCheckbox from './RememberMeCheckbox';
import { useAuth } from '../../hooks/useAuth';

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: yup.boolean(),
});

const LoginForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showError, setShowError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'admin@cbt-platform.com',
      password: 'Secure@123',
      rememberMe: false,
    },
  });

 // LoginForm.js - Update the onSubmit handler
const onSubmit = async (data) => {
  console.log('🔐 Form data:', data); // This should show { email: "admin@...", password: "Secure@123" }
  setShowError(false);
  clearError();

  // ✅ IMPORTANT: Pass data directly, not wrapped
  const result = await login(data); // ✅ This is correct - data is already { email, password }

  if (result?.success) {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/dashboard');
    }
  } else {
    setShowError(true);
  }
};

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {(error || showError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Invalid email or password'}
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

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField
            {...field}
            label="Password"
            disabled={isLoading}
            error={errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 1 }}
            autoComplete="current-password"
          />
        )}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <RememberMeCheckbox
              checked={field.value}
              onChange={field.onChange}
              disabled={isLoading}
            />
          )}
        />

        <Link
          href="/forgot-password"
          variant="body2"
          sx={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{ py: 1.5, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="textSecondary" align="center">
        Demo Credentials:
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.75rem' }}>
        admin@cbt-platform.com / Secure@123
      </Typography>
    </Box>
  );
};

export default LoginForm;