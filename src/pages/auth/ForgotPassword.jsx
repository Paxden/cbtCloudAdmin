/* eslint-disable no-unused-vars */
/**
 * Forgot Password Page
 * Password reset request page
 */

import { Box, Container } from '@mui/material';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import AuthCard from '../../components/auth/AuthCard';

const ForgotPassword = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <AuthCard title="Forgot Password" subtitle="Reset your account password">
        <ForgotPasswordForm />
      </AuthCard>
    </Box>
  );
};

export default ForgotPassword;