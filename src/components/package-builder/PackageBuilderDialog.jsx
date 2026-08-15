/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * PackageBuilderDialog
 * Dialog for building CBTX packages
 * 
 * Location: src/components/package-builder/PackageBuilderDialog.jsx
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
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Paper,
  IconButton 
} from '@mui/material';
import {
  Build as BuildIcon,
  Replay as ReplayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { FileStatus, FileStatusLabels, FileStatusColors } from '../../types/packageBuilder.types';

const PackageBuilderDialog = ({
  open,
  onClose,
  packageId,
  packageCode,
  onBuild,
  onRebuild,
  onDownload,
  building,
  rebuilding,
  downloading,
  fileRecord,
  buildResult,
}) => {
  const [buildStatus, setBuildStatus] = useState('idle'); // idle, building, built, failed

  useEffect(() => {
    if (building) {
      setBuildStatus('building');
    } else if (buildResult) {
      setBuildStatus('built');
    } else if (buildResult === null && !building) {
      setBuildStatus('idle');
    }
  }, [building, buildResult]);

  const handleBuild = () => {
    setBuildStatus('building');
    onBuild(packageId);
  };

  const handleRebuild = () => {
    setBuildStatus('building');
    onRebuild(packageId);
  };

  const handleDownload = () => {
    if (fileRecord) {
      onDownload(packageId, fileRecord.fileName);
    }
  };

  const getStatusChip = (status) => {
    const label = FileStatusLabels[status] || status;
    const color = FileStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === FileStatus.CREATED) icon = <CheckCircleIcon />;
    else if (status === FileStatus.FAILED) icon = <ErrorIcon />;
    else if (status === FileStatus.BUILDING) icon = <BuildIcon />;
    
    return (
      <Chip
        icon={icon}
        label={label}
        size="small"
        sx={{
          bgcolor: color,
          color: 'white',
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    );
  };

  const isBuilt = fileRecord?.status === FileStatus.CREATED;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Package Builder</Typography>
            <Typography variant="body2" color="text.secondary">
              {packageCode || 'Build CBTX Package'}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Build Status */}
        {(building || rebuilding) && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" icon={<BuildIcon />}>
              {rebuilding ? 'Rebuilding package...' : 'Building package...'}
            </Alert>
            <LinearProgress sx={{ mt: 2 }} />
          </Box>
        )}

        {/* Build Result */}
        {buildResult && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Package built successfully!
            </Alert>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>File:</strong> {buildResult.fileName}
                </Typography>
                <Typography variant="body2">
                  <strong>Size:</strong> {buildResult.fileSizeFormatted || `${buildResult.fileSize} bytes`}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {buildResult.generation?.durationMs || 0}ms
                </Typography>
                <Typography variant="body2">
                  <strong>Files:</strong> {buildResult.structure?.fileCount || 0}
                </Typography>
                {buildResult.structure?.errors?.length > 0 && (
                  <Alert severity="warning" size="small">
                    {buildResult.structure.errors.length} validation errors
                  </Alert>
                )}
              </Stack>
            </Paper>
          </Box>
        )}

        {/* File Record */}
        {fileRecord && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Package File
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  <strong>Status:</strong>
                </Typography>
                {getStatusChip(fileRecord.status)}
              </Box>
              <Typography variant="body2">
                <strong>File:</strong> {fileRecord.fileName}
              </Typography>
              <Typography variant="body2">
                <strong>Size:</strong> {fileRecord.fileSizeFormatted || `${fileRecord.fileSize} bytes`}
              </Typography>
              <Typography variant="body2">
                <strong>Format:</strong> {fileRecord.compressionFormat}
              </Typography>
              <Typography variant="body2">
                <strong>Manifest:</strong> v{fileRecord.manifestVersion}
              </Typography>
              {fileRecord.generation?.startedAt && (
                <Typography variant="body2">
                  <strong>Generated:</strong> {new Date(fileRecord.generation.startedAt).toLocaleString()}
                </Typography>
              )}
              {fileRecord.errorDetails?.message && (
                <Alert severity="error" size="small">
                  {fileRecord.errorDetails.message}
                </Alert>
              )}
            </Stack>
          </Paper>
        )}

        {/* Info */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Building a package creates an immutable CBTX file containing all encrypted assets,
            metadata, signatures, and integrity information.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>Close</Button>
        
        {isBuilt && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download'}
          </Button>
        )}
        
        {isBuilt && (
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={handleRebuild}
            disabled={building || rebuilding}
          >
            Rebuild
          </Button>
        )}
        
        {!isBuilt && (
          <Button
            variant="contained"
            startIcon={<BuildIcon />}
            onClick={handleBuild}
            disabled={building || rebuilding}
          >
            {building ? 'Building...' : 'Build Package'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PackageBuilderDialog;