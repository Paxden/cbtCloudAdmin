/* eslint-disable no-unused-vars */
/**
 * Auth Card Component
 * Reusable card wrapper for authentication pages
 * Provides consistent styling for login, forgot password, reset password pages
 */

import { Box, Paper, Typography, Stack } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

const AuthCard = ({
  title,
  subtitle,
  children,
  maxWidth = 420,
  showLogo = true,
}) => {
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
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          width: '100%',
          maxWidth,
        }}
      >
        {/* Logo */}
        {showLogo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={700} color="primary">
              CBT Platform
            </Typography>
          </Box>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {/* Title */}
        {title && (
          <Typography
            variant="h6"
            fontWeight={600}
            align="center"
            sx={{ mb: 3, width: '100%' }}
          >
            {title}
          </Typography>
        )}

        {/* Content */}
        <Box sx={{ width: '100%' }}>{children}</Box>
      </Paper>
    </Box>
  );
};

export default AuthCard;