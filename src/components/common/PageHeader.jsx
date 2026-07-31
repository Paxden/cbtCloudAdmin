/**
 * Page Header Component
 * Reusable page header with title, subtitle, and actions
 */

import { Box, Typography, Stack } from '@mui/material';

const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumb,
  divider = true,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumb && <Box sx={{ mb: 1 }}>{breadcrumb}</Box>}

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

export default PageHeader;