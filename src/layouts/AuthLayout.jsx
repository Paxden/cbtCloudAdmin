/**
 * Auth Layout
 * Centered layout for authentication pages
 */

import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
            CBT Platform
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Cloud Admin Dashboard
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;