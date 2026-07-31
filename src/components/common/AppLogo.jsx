/**
 * App Logo Component
 * Reusable application logo
 */

import { Box, Typography } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AppLogo = ({ variant = 'full', size = 'medium' }) => {
  const sizes = {
    small: { iconSize: 24, fontSize: '1rem' },
    medium: { iconSize: 32, fontSize: '1.25rem' },
    large: { iconSize: 40, fontSize: '1.5rem' },
  };

  const { iconSize, fontSize } = sizes[size] || sizes.medium;

  if (variant === 'icon') {
    return (
      <Box
        component={Link}
        to="/dashboard"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
        }}
      >
        <SchoolIcon sx={{ fontSize: iconSize, color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box
      component={Link}
      to="/dashboard"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
      }}
    >
      <SchoolIcon sx={{ fontSize: iconSize, color: 'primary.main' }} />
      <Typography
        variant="h6"
        fontWeight={700}
        color="primary"
        sx={{ fontSize }}
      >
        CBT Admin
      </Typography>
    </Box>
  );
};

export default AppLogo;