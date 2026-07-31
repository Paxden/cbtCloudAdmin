/**
 * Import Details Drawer Component
 * Displays detailed import information
 */

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Paper,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import ImportStatusChip from './ImportStatusChip';
import { format } from 'date-fns';

const DetailRow = ({ label, value, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="50%" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    </Box>
  );
};

const ImportDetailsDrawer = ({
  open,
  importData,
  onClose,
  loading = false,
  onDownload,
}) => {
  if (!importData && !loading) {
    return null;
  }

  const renderErrors = () => {
    const errors = importData?.errors || [];
    if (errors.length === 0) {
      return (
        <Alert severity="success" sx={{ mt: 2 }}>
          No errors found. All questions passed validation.
        </Alert>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map((error, index) => (
              <TableRow key={index}>
                <TableCell>{error.row}</TableCell>
                <TableCell>{error.field || 'General'}</TableCell>
                <TableCell>{error.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderWarnings = () => {
    const warnings = importData?.warnings || [];
    if (warnings.length === 0) {
      return null;
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 200 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warnings.map((warning, index) => (
              <TableRow key={index}>
                <TableCell>{warning.row}</TableCell>
                <TableCell>{warning.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600 },
          p: 3,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Import Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={20} />
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} variant="text" height={30} />
          ))}
        </Box>
      ) : (
        <Box>
          {/* File Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={500}>
                {importData.fileName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip label={importData.fileType?.toUpperCase()} size="small" variant="outlined" />
                <ImportStatusChip status={importData.status} size="small" />
              </Box>
            </Box>
            {importData.status === 'COMPLETED' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => onDownload(importData._id)}
              >
                Report
              </Button>
            )}
          </Box>

          {/* Summary Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={600}>
                  {importData.totalRecords || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Total
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                <Typography variant="h4" fontWeight={600} color="success.main">
                  {importData.successfulRecords || 0}
                </Typography>
                <Typography variant="caption" color="success.main">
                  Imported
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                <Typography variant="h4" fontWeight={600} color="error.main">
                  {importData.failedRecords || 0}
                </Typography>
                <Typography variant="caption" color="error.main">
                  Failed
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Details */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Import Information
          </Typography>

          <Stack spacing={0.5}>
            <DetailRow label="File Type" value={importData.fileType?.toUpperCase()} />
            <DetailRow
              label="File Size"
              value={importData.fileSize ? `${(importData.fileSize / 1024).toFixed(1)} KB` : '-'}
            />
            <DetailRow label="Uploaded By" value={importData.uploadedBy?.name || 'Unknown'} />
            <DetailRow
              label="Created Date"
              value={importData.createdAt ? format(new Date(importData.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <DetailRow
              label="Completed Date"
              value={importData.completedAt ? format(new Date(importData.completedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <DetailRow
              label="Processing Time"
              value={importData.processingTime ? `${(importData.processingTime / 1000).toFixed(1)}s` : '-'}
            />
            <DetailRow label="Warnings" value={importData.warningRecords || 0} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Errors */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Errors ({importData?.errors?.length || 0})
          </Typography>
          {renderErrors()}

          {/* Warnings */}
          {importData?.warnings?.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
                Warnings ({importData.warnings.length})
              </Typography>
              {renderWarnings()}
            </>
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default ImportDetailsDrawer;