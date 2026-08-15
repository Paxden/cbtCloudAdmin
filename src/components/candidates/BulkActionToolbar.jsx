/**
 * Bulk Action Toolbar Component
 * Bulk actions for selected candidates
 */

import { Box, Button, Stack, Typography, Divider } from '@mui/material';
import {
  CheckCircle as ActivateIcon,
  Cancel as DeactivateIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const BulkActionToolbar = ({
  selectedCount,
  onActivate,
  onDeactivate,
  onDelete,
  loading,
  canActivate,
  canDelete,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'action.hover',
        borderRadius: 1,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Typography variant="body2" fontWeight={500}>
        {selectedCount} candidate{selectedCount > 1 ? 's' : ''} selected
      </Typography>

      <Divider orientation="vertical" flexItem />

      <Stack direction="row" spacing={1}>
        {canActivate && (
          <Button
            size="small"
            variant="outlined"
            color="success"
            startIcon={<ActivateIcon />}
            onClick={onActivate}
            disabled={loading}
          >
            Activate
          </Button>
        )}

        {canActivate && (
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<DeactivateIcon />}
            onClick={onDeactivate}
            disabled={loading}
          >
            Deactivate
          </Button>
        )}

        {canDelete && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default BulkActionToolbar;