/**
 * App Page Header Component
 * Reusable page header with title, subtitle, and actions
 */

import { Box, Typography, Stack, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const AppPageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs = [],
  onBreadcrumbClick,
  divider = true,
  sx = {},
}) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" color="disabled" />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={crumb.label} color="text.primary" fontWeight={500}>
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.label}
                component="button"
                color="inherit"
                onClick={() => onBreadcrumbClick && onBreadcrumbClick(crumb.path)}
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Title & Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Stack direction="row" spacing={1}>
            {actions}
          </Stack>
        )}
      </Box>

      {divider && (
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            mt: 2,
            pt: 2,
          }}
        />
      )}
    </Box>
  );
};

export default AppPageHeader;