/* eslint-disable no-unused-vars */
/**
 * Login Form Component
 * Login form with validation and enhanced UX
 * 
 * Key Improvements:
 * - Better error handling
 * - Loading states
 * - Password strength indicator
 * - Social login placeholders
 * - Smooth transitions
 * - Accessibility improvements
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
  Stack,
  alpha,
  useTheme,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import PasswordField from './PasswordField';
import RememberMeCheckbox from './RememberMeCheckbox';
import { useAuth } from '../../hooks/useAuth';

// Enhanced validation schema
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

const LoginForm = ({ onSuccess, redirectTo = '/dashboard' }) => {
  const theme = useTheme();
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
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setShowError(false);
    clearError();

    const result = await login(data);

    if (result?.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectTo);
      }
    } else {
      setShowError(true);
    }
  };



  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {/* Error Alert */}
      <Collapse in={!!error || showError}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowError(false);
                clearError();
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error || 'Invalid email or password. Please try again.'}
        </Alert>
      </Collapse>

  

      {/* Email Field */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email Address"
            type="email"
            fullWidth
            required
            disabled={isLoading}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
            autoComplete="email"
            placeholder="Enter your email"
            InputProps={{
              sx: {
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />
        )}
      />

      {/* Password Field */}
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
            placeholder="Enter your password"
          />
        )}
      />

      {/* Options */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
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
          sx={{
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Forgot password?
        </Link>
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{
          py: 1.5,
          mb: 2,
          fontSize: '1rem',
          position: 'relative',
          overflow: 'hidden',
          '&::after': isLoading ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 1.5s infinite',
            '@keyframes shimmer': {
              '100%': {
                left: '100%',
              },
            },
          } : {},
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>

      {/* Divider */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Divider>
         
        </Divider>
      </Box>

     

      {/* Sign Up Link */}
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ mt: 1 }}
      >
        Don't have an account?{' '}
        <Link
          href="/register"
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;