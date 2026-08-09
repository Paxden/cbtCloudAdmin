/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * ChecksumDialog
 * Dialog for generating and verifying checksums
 * 
 * Location: src/components/checksum/ChecksumDialog.jsx
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
  Fingerprint as FingerprintIcon,
  Verified as VerifiedIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  GppBad as GppBadIcon,
} from '@mui/icons-material';
import {
  ChecksumStatus,
  ChecksumStatusLabels,
  FileTypeLabels,
} from '../../types/checksum.types';

const ChecksumDialog = ({
  open,
  onClose,
  packageId,
  packageCode,
  checksumStatus,
  onGenerate,
  onVerify,
  loading = false,
  error = null,
  result = null,
  mode = 'generate', // generate, verify
}) => {
  const [showFingerprint, setShowFingerprint] = useState(false);

  useEffect(() => {
    if (open) {
      setShowFingerprint(false);
    }
  }, [open]);

  const getTitle = () => {
    switch (mode) {
      case 'generate': return 'Generate Checksum';
      case 'verify': return 'Verify Integrity';
      default: return 'Checksum Operation';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'generate': return <FingerprintIcon />;
      case 'verify': return <VerifiedIcon />;
      default: return <FingerprintIcon />;
    }
  };

  const getColor = () => {
    switch (mode) {
      case 'generate': return 'primary';
      case 'verify': return 'success';
      default: return 'primary';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'generate':
        return 'This will generate a SHA-256 checksum for all package assets and create a unique fingerprint.';
      case 'verify':
        return 'This will verify the integrity of all package assets against the stored checksum.';
      default:
        return '';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ py: 4 }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            {mode === 'generate' ? 'Generating checksum...' : 'Verifying integrity...'}
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" icon={<ErrorIcon />}>
          {error.message || 'Operation failed'}
        </Alert>
      );
    }

    if (result) {
      const isVerified = result.verified || result.status === ChecksumStatus.VERIFIED;
      
      return (
        <Box>
          <Alert 
            severity={isVerified ? 'success' : 'error'} 
            icon={isVerified ? <CheckCircleIcon /> : <GppBadIcon />}
            sx={{ mb: 2 }}
          >
            {mode === 'generate' 
              ? 'Checksum generated successfully!' 
              : isVerified 
                ? 'Integrity verified successfully!' 
                : 'Integrity verification failed!'}
          </Alert>

          {/* Fingerprint */}
          {result.fingerprint && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Package Fingerprint
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FingerprintIcon fontSize="small" color="primary" />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {result.fingerprint}
                </Typography>
              </Box>
              {result.shortFingerprint && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: 'monospace', display: 'block', mt: 0.5 }}
                >
                  Short: {result.shortFingerprint}
                </Typography>
              )}
            </Paper>
          )}

          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={isVerified ? 'Verified' : 'Failed'}
                size="small"
                color={isVerified ? 'success' : 'error'}
              />
            </Box>

            {mode === 'generate' && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Algorithm
                  </Typography>
                  <Typography variant="body2">{result.algorithm || 'SHA-256'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    File Count
                  </Typography>
                  <Typography variant="body2">{result.fileCount || 0}</Typography>
                </Box>
                {result.packageSize > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Package Size
                    </Typography>
                    <Typography variant="body2">
                      {formatFileSize(result.packageSize)}
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {mode === 'verify' && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Verified
                  </Typography>
                  <Chip
                    label={result.verified ? 'Yes' : 'No'}
                    size="small"
                    color={result.verified ? 'success' : 'error'}
                  />
                </Box>
                {result.failedFiles && result.failedFiles.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="error" gutterBottom>
                      Failed Files:
                    </Typography>
                    {result.failedFiles.map((file, idx) => (
                      <Typography key={idx} variant="caption" color="error" display="block">
                        • {FileTypeLabels[file] || file}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Combined Hash Match
                  </Typography>
                  <Chip
                    label={result.combinedHashMatch ? 'Yes' : 'No'}
                    size="small"
                    color={result.combinedHashMatch ? 'success' : 'error'}
                  />
                </Box>
              </>
            )}
          </Stack>
        </Box>
      );
    }

    // Confirmation
    return (
      <Box>
        <Alert severity={mode === 'verify' ? 'info' : 'warning'} sx={{ mb: 3 }}>
          {getDescription()}
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
              Current Status
            </Typography>
            <Chip
              label={ChecksumStatusLabels[checksumStatus?.status] || 'Not Generated'}
              size="small"
              color={checksumStatus?.status === ChecksumStatus.VERIFIED ? 'success' : 'default'}
            />
          </Box>
        </Stack>

        {mode === 'verify' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This will check all file hashes against the stored checksum to detect any tampering or corruption.
          </Alert>
        )}
      </Box>
    );
  };

  const canSubmit = () => {
    return !loading && !result;
  };

  const getSubmitLabel = () => {
    if (loading) return 'Processing...';
    if (result) return 'Done';
    switch (mode) {
      case 'generate': return 'Generate Checksum';
      case 'verify': return 'Verify Integrity';
      default: return 'Submit';
    }
  };

  const handleSubmit = () => {
    if (mode === 'generate') {
      onGenerate(packageId);
    } else if (mode === 'verify') {
      onVerify(packageId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getIcon()}
            <Typography variant="h6">{getTitle()}</Typography>
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
            color={getColor()}
            onClick={handleSubmit}
            disabled={!canSubmit()}
            startIcon={getIcon()}
          >
            {getSubmitLabel()}
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

export default ChecksumDialog;