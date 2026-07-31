/**
 * Auth Header Component
 * Header for auth pages
 */

import { Box, Typography } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

const AuthHeader = ({ title, subtitle }) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
        <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight={700} color="primary">
          CBT Platform
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      )}
      {title && (
        <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default AuthHeader;