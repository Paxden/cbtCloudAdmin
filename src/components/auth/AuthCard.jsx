/**
 * Auth Card Component
 * Reusable card wrapper for authentication pages
 * Provides consistent styling with enhanced UX
 * 
 * Key Improvements:
 * - Gradient background
 * - Better visual hierarchy
 * - Responsive design
 * - Glassmorphism effect
 * - Smooth animations
 * - Brand consistency
 */

import { Box, Paper, Typography,  alpha, useTheme } from '@mui/material';
import { School as SchoolIcon, Verified as VerifiedIcon } from '@mui/icons-material';

const AuthCard = ({
  title,
  subtitle,
  children,
  maxWidth = 420,
  showLogo = true,
  showBrand = true,
  variant = 'default', // 'default' | 'glass' | 'gradient'
}) => {
  const theme = useTheme();

  // Variant styles
  const getPaperStyles = () => {
    const baseStyles = {
      p: { xs: 3, sm: 4 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: 3,
      width: '100%',
      maxWidth,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyles,
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.1),
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        };
      case 'gradient':
        return {
          ...baseStyles,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        };
      default:
        return {
          ...baseStyles,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        };
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
        backgroundImage: `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 50%),
                          radial-gradient(circle at 90% 80%, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 50%)`,
      }}
    >
      <Paper elevation={0} sx={getPaperStyles()}>
        {/* Decorative background element */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.secondary.main, 0.03),
            pointerEvents: 'none',
          }}
        />

        {/* Logo & Brand */}
        {showLogo && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: showBrand ? 0.5 : 2,
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SchoolIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            {showBrand && (
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CBT Platform
              </Typography>
            )}
          </Box>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{
              mb: title ? 1 : 2,
              fontSize: '0.875rem',
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
            align="center"
            sx={{
              mb: 3,
              width: '100%',
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
        )}

        {/* Content */}
        <Box sx={{ width: '100%' }}>{children}</Box>

        {/* Footer decoration */}
        {variant === 'gradient' && (
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
              }}
            >
              <VerifiedIcon sx={{ fontSize: 14 }} />
              Secure & Encrypted
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AuthCard;