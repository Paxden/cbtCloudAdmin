/**
 * Auth Header Component
 * Header for auth pages with enhanced branding
 * 
 * Key Improvements:
 * - Gradient text
 * - Better spacing
 * - Icon animation
 * - Responsive design
 * - Professional styling
 */

import { Box, Typography, alpha, useTheme } from '@mui/material';
import { School as SchoolIcon, Verified as VerifiedIcon } from '@mui/icons-material';

const AuthHeader = ({
  title,
  subtitle,
  showBadge = true,
  variant = 'default', // 'default' | 'centered' | 'compact'
}) => {
  const theme = useTheme();

  const getContainerStyles = () => {
    switch (variant) {
      case 'centered':
        return {
          textAlign: 'center',
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        };
      case 'compact':
        return {
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          justifyContent: 'center',
        };
      default:
        return {
          textAlign: 'center',
          mb: 3,
        };
    }
  };

  return (
    <Box sx={getContainerStyles()}>
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: variant === 'compact' ? 1.5 : 1,
          mb: variant === 'compact' ? 0 : 1,
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            borderRadius: 2,
            p: variant === 'compact' ? 1 : 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
              },
              '50%': {
                transform: 'scale(1.05)',
              },
              '100%': {
                transform: 'scale(1)',
              },
            },
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: variant === 'compact' ? 24 : 32,
              color: 'white',
            }}
          />
        </Box>
        <Typography
          variant={variant === 'compact' ? 'h6' : 'h4'}
          fontWeight={700}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CBT Platform
        </Typography>
      </Box>

      {/* Security Badge */}
      {showBadge && variant !== 'compact' && (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.success.main, 0.08),
            color: 'success.main',
            mb: 1,
          }}
        >
          <VerifiedIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" fontWeight={500}>
            Secure Platform
          </Typography>
        </Box>
      )}

      {/* Subtitle */}
      {subtitle && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mb: title ? 1 : 0,
            maxWidth: variant === 'centered' ? 400 : '100%',
          }}
        >
          {subtitle}
        </Typography>
      )}

      {/* Title */}
      {title && (
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{
            color: 'text.primary',
            mt: 0.5,
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default AuthHeader;