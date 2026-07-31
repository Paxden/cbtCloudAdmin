/**
 * Breadcrumbs Component
 * Navigation breadcrumb trail
 */

import {  useNavigate } from 'react-router-dom';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Link as MuiLink,
  Box,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useNavigation } from '../../hooks/useNavigation';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const { breadcrumbs } = useNavigation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (breadcrumbs.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        Dashboard
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" color="disabled" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap',
            overflow: 'hidden',
          },
          '& .MuiBreadcrumbs-li': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 200,
          },
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={crumb.path}
                variant="body2"
                color="text.primary"
                fontWeight={500}
                noWrap
              >
                {crumb.label}
              </Typography>
            );
          }

          return (
            <MuiLink
              key={crumb.path}
              component="button"
              variant="body2"
              color="textSecondary"
              onClick={() => handleNavigate(crumb.path)}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
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