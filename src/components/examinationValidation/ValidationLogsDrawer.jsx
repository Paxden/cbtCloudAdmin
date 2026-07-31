/**
 * Validation Logs Drawer Component
 * Displays detailed validation logs
 */

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Divider,
  Paper,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  CheckCircle as PassedIcon,
  Cancel as FailedIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import ValidationStatusChip from './ValidationStatusChip';

const LogEntry = ({ entry }) => {
  const getIcon = () => {
    if (entry.status === 'PASSED') return <PassedIcon color="success" fontSize="small" />;
    if (entry.status === 'WARNING') return <WarningIcon color="warning" fontSize="small" />;
    if (entry.status === 'FAILED') return <FailedIcon color="error" fontSize="small" />;
    return null;
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 1,
        borderColor: entry.status === 'FAILED' ? 'error.main' : 'divider',
        bgcolor: entry.status === 'FAILED' ? 'error.lighter' : 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {getIcon()}
        <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>
          {entry.timestamp ? format(new Date(entry.timestamp), 'HH:mm:ss') : 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {entry.message}
        </Typography>
        {entry.duration && (
          <Chip
            label={`${entry.duration}ms`}
            size="small"
            variant="outlined"
          />
        )}
        <ValidationStatusChip status={entry.status} size="small" />
      </Stack>
      {entry.details && (
        <Typography variant="caption" color="textSecondary" sx={{ ml: 4, display: 'block' }}>
          {entry.details}
        </Typography>
      )}
    </Paper>
  );
};

const ValidationLogsDrawer = ({
  open,
  onClose,
  logs,
  loading,
  validationId,
}) => {
  if (!open) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          p: 3,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Validation Logs
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {validationId && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="caption" color="textSecondary">
            Validation ID:
          </Typography>
          <Typography variant="caption" fontFamily="monospace">
            {validationId}
          </Typography>
        </Stack>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">Loading logs...</Typography>
        </Box>
      ) : !logs || logs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">No logs available</Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          {logs.map((log, index) => (
            <LogEntry key={index} entry={log} />
          ))}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            // Download logs
            const blob = new Blob(
              [logs?.map(l => JSON.stringify(l)).join('\n') || ''],
              { type: 'application/json' }
            );
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `validation_logs_${validationId}.json`;
            link.click();
            window.URL.revokeObjectURL(url);
          }}
          startIcon={<DownloadIcon />}
          disabled={!logs || logs.length === 0}
        >
          Download Logs
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Stack>
    </Drawer>
  );
};

export default ValidationLogsDrawer;