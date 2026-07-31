/**
 * Reset Password Page
 * Password reset page
 */

import { Box } from '@mui/material';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import AuthCard from '../../components/auth/AuthCard';

const ResetPassword = () => {
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
      <AuthCard title="Reset Password" subtitle="Create a new password">
        <ResetPasswordForm />
      </AuthCard>
    </Box>
  );
};

export default ResetPassword;