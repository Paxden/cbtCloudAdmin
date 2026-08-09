/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * DownloadDialog
 * Dialog for initiating package downloads
 * 
 * Location: src/components/download/DownloadDialog.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { DownloadStatusLabels } from '../../types/download.types';

const DownloadDialog = ({
  open,
  onClose,
  packageId,
  packageCode,
  centreId,
  centreCode,
  onInitiate,
  loading = false,
  error = null,
  result = null,
}) => {
  const [downloadStatus, setDownloadStatus] = useState('idle');

  useEffect(() => {
    if (open) {
      setDownloadStatus('idle');
    }
  }, [open]);

  useEffect(() => {
    if (loading) {
      setDownloadStatus('downloading');
    } else if (result) {
      setDownloadStatus('completed');
    }
  }, [loading, result]);

  const handleDownload = () => {
    onInitiate(packageId, centreId);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ py: 4 }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Initiating download...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" icon={<ErrorIcon />}>
          {error.message || 'Download initiation failed'}
        </Alert>
      );
    }

    if (result) {
      return (
        <Box>
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
            Download initiated successfully!
          </Alert>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Package
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {packageCode || packageId}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Centre
                </Typography>
                <Typography variant="body2">
                  {centreCode}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  File Name
                </Typography>
                <Typography variant="body2">
                  {result.fileName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  File Size
                </Typography>
                <Typography variant="body2">
                  {formatFileSize(result.fileSize)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={DownloadStatusLabels[result.downloadStatus] || result.downloadStatus}
                  size="small"
                  color={result.downloadStatus === 'STARTED' ? 'primary' : 'default'}
                />
              </Box>

              {result.downloadToken && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Download Token
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      wordBreak: 'break-all',
                    }}
                  >
                    {result.downloadToken.substring(0, 16)}...
                  </Typography>
                </Box>
              )}

              {result.tokenExpiresAt && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Token Expires
                  </Typography>
                  <Typography variant="body2">
                    {new Date(result.tokenExpiresAt).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Box>
      );
    }

    // Confirmation
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          This will initiate the download of the package. You will receive a secure download link.
        </Alert>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Package
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {packageCode || packageId}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Centre
            </Typography>
            <Typography variant="body2">
              {centreCode}
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  };

  const canSubmit = () => {
    return !loading && !result;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DownloadIcon />
            <Typography variant="h6">Download Package</Typography>
          </Box>
          <Button onClick={onClose} disabled={loading}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {renderContent()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!canSubmit()}
          >
            {loading ? 'Initiating...' : 'Download Package'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default DownloadDialog;