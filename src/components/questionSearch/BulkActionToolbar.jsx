/**
 * Bulk Action Toolbar Component
 * Toolbar for bulk operations on selected questions
 */

import { Box, Paper, Typography, Button, Stack, Chip } from '@mui/material';
import {
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  Publish as PublishIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const BulkActionToolbar = ({
  selected,
  onClearSelection,
  onArchive,
  onSubmitReview,
  onPublish,
  onExport,
  loading = false,
}) => {
  if (!selected || selected.length === 0) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        bgcolor: 'primary.light',
        borderColor: 'primary.main',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {selected.length} question{selected.length > 1 ? 's' : ''} selected
        </Typography>
        <Chip
          label="Clear Selection"
          size="small"
          onDelete={onClearSelection}
          deleteIcon={<ClearIcon />}
        />
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArchiveIcon />}
          onClick={() => onArchive(selected)}
          disabled={loading}
        >
          Archive
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CheckCircleIcon />}
          onClick={() => onSubmitReview(selected)}
          disabled={loading}
          color="warning"
        >
          Submit for Review
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<PublishIcon />}
          onClick={() => onPublish(selected)}
          disabled={loading}
          color="success"
        >
          Publish
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => onExport(selected)}
          disabled={loading}
        >
          Export
        </Button>
      </Stack>
    </Paper>
  );
};

export default BulkActionToolbar;