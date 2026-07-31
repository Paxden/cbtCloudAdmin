/* eslint-disable no-unused-vars */
/**
 * Change Password Page
 * Change password page for authenticated users
 */

import { Box, Typography } from '@mui/material';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import AuthCard from '../../components/auth/AuthCard';

const ChangePassword = () => {
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
      <AuthCard title="Change Password" subtitle="Update your account password">
        <ChangePasswordForm />
      </AuthCard>
    </Box>
  );
};

export default ChangePassword;