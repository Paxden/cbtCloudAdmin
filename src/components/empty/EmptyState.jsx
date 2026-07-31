/**
 * Empty State Component
 * Display when no data is available
 */

import { Box, Typography, Button } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

const EmptyState = ({
  title = 'No data available',
  description = 'There is no data to display at the moment.',
  icon: Icon = InboxIcon,
  actionText,
  onAction,
  actionVariant = 'contained',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Icon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      {actionText && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;