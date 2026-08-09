/* eslint-disable no-unused-vars */
/**
 * PackageStatusCard
 * Displays package build status information
 * 
 * Location: src/components/package-builder/PackageStatusCard.jsx
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { FileStatus, FileStatusLabels, FileStatusColors } from '../../types/packageBuilder.types';

const PackageStatusCard = ({ fileRecord, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Package Status
          </Typography>
          <LinearProgress />
          <Typography sx={{ mt: 1 }}>Loading status...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!fileRecord) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Package Status
          </Typography>
          <Typography color="text.secondary">No package file record found</Typography>
          <Typography variant="caption" color="text.secondary">
            Build the package to generate a file record
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case FileStatus.CREATED:
        return <CheckCircleIcon />;
      case FileStatus.FAILED:
      case FileStatus.CORRUPTED:
        return <ErrorIcon />;
      case FileStatus.BUILDING:
        return <BuildIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case FileStatus.CREATED:
        return 'success';
      case FileStatus.FAILED:
      case FileStatus.CORRUPTED:
        return 'error';
      case FileStatus.BUILDING:
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Package Status
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <Chip
            icon={getStatusIcon(fileRecord.status)}
            label={FileStatusLabels[fileRecord.status] || fileRecord.status}
            color={getStatusColor(fileRecord.status)}
          />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              File Name
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {fileRecord.fileName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              File Size
            </Typography>
            <Typography variant="body2">
              {fileRecord.fileSizeFormatted || `${fileRecord.fileSize || 0} bytes`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Format
            </Typography>
            <Typography variant="body2">{fileRecord.compressionFormat}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Manifest Version
            </Typography>
            <Typography variant="body2">v{fileRecord.manifestVersion}</Typography>
          </Box>

          {fileRecord.generation?.startedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Generated
              </Typography>
              <Typography variant="body2">
                {new Date(fileRecord.generation.startedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {fileRecord.generation?.durationMs > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Build Duration
              </Typography>
              <Typography variant="body2">{fileRecord.generation.durationMs}ms</Typography>
            </Box>
          )}

          {fileRecord.structure?.fileCount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Internal Files
              </Typography>
              <Typography variant="body2">{fileRecord.structure.fileCount}</Typography>
            </Box>
          )}
        </Stack>

        {fileRecord.structure?.errors?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="error">
              {fileRecord.structure.errors.length} validation errors
            </Typography>
          </Box>
        )}

        {fileRecord.errorDetails?.message && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="error">
              Error: {fileRecord.errorDetails.message}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PackageStatusCard;