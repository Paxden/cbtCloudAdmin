/* eslint-disable no-unused-vars */
/**
 * Breadcrumbs Component
 * Navigation breadcrumb trail with enhanced UX
 * 
 * Key Improvements:
 * - Smooth animations
 * - Better visual hierarchy
 * - Responsive truncation
 * - Hover effects
 * - Keyboard navigation
 * - Home indicator
 */

import { useNavigate, useLocation } from 'react-router-dom';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Link as MuiLink,
  Box,
  Tooltip,
  IconButton,
  alpha,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
import { useNavigation } from '../../hooks/useNavigation';
import { useState } from 'react';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { breadcrumbs } = useNavigation();
  const [isHovering, setIsHovering] = useState(false);

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  // If no breadcrumbs, show dashboard
  if (breadcrumbs.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HomeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography
          variant="body2"
          color="textPrimary"
          fontWeight={500}
          sx={{
            fontSize: '0.875rem',
          }}
        >
          Dashboard
        </Typography>
      </Box>
    );
  }

  // Determine if we should show all items or truncate
  const maxItems = 4;
  const shouldTruncate = breadcrumbs.length > maxItems;
  const visibleItems = shouldTruncate 
    ? [breadcrumbs[0], ...breadcrumbs.slice(-2)]
    : breadcrumbs;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,
        gap: 0.5,
      }}
    >
      {/* Home Icon */}
      <Tooltip title="Go to dashboard">
        <IconButton
          size="small"
          onClick={() => handleNavigate('/dashboard')}
          sx={{
            p: 0.5,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              bgcolor: alpha('#2563eb', 0.04),
            },
            transition: 'all 0.2s',
          }}
        >
          <HomeIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <MuiBreadcrumbs
        separator={
          <NavigateNextIcon 
            fontSize="small" 
            sx={{ 
              color: 'text.disabled',
              fontSize: 16,
            }} 
          />
        }
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap',
            overflow: 'hidden',
            alignItems: 'center',
          },
          '& .MuiBreadcrumbs-li': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 200,
            display: 'flex',
            alignItems: 'center',
            '&:last-child': {
              maxWidth: 250,
            },
          },
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
          },
        }}
      >
        {/* Truncation indicator */}
        {shouldTruncate && (
          <Tooltip title="More pages">
            <Box
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                px: 0.5,
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </Box>
          </Tooltip>
        )}

        {visibleItems.map((crumb, index) => {
          const isLast = index === visibleItems.length - 1;
          const isHome = crumb.path === '/dashboard';

          // Skip home if it's the first item and we have more
          if (isHome && breadcrumbs.length > 1) {
            return null;
          }

          if (isLast) {
            return (
              <Typography
                key={crumb.path || crumb.label}
                variant="body2"
                color="textPrimary"
                fontWeight={600}
                noWrap
                sx={{
                  fontSize: '0.875rem',
                  letterSpacing: '0.01em',
                }}
              >
                {crumb.label}
              </Typography>
            );
          }

          return (
            <MuiLink
              key={crumb.path || crumb.label}
              component="button"
              variant="body2"
              color="textSecondary"
              onClick={() => handleNavigate(crumb.path)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'none',
                },
                '&:focus': {
                  outline: 'none',
                  color: 'primary.main',
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                  borderRadius: 1,
                },
              }}
            >
              {crumb.label}
            </MuiLink>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;