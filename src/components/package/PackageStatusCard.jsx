/* eslint-disable no-unused-vars */
/**
 * PackageStatusCard
 * Displays package status and information
 * 
 * Location: src/components/package/PackageStatusCard.jsx
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Inventory as PackageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  PackageStatus,
  PackageStatusLabels,
  PackageStatusColors,
} from '../../types/package.types';

const PackageStatusCard = ({
  packageData,
  loading = false,
  onRefresh,
  onViewDetails,
}) => {
  const getStatusChip = (status) => {
    const label = PackageStatusLabels[status] || status;
    const color = PackageStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === PackageStatus.GENERATED || status === PackageStatus.VALIDATED) {
      icon = <CheckCircleIcon />;
    } else if (status === PackageStatus.GENERATING) {
      icon = <PendingIcon />;
    } else if (status === PackageStatus.REVOKED || status === PackageStatus.ARCHIVED) {
      icon = <ErrorIcon />;
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        sx={{
          bgcolor: color,
          color: 'white',
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PackageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Package Details
          </Typography>
          <LinearProgress />
          <Typography sx={{ mt: 1 }}>Loading package details...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!packageData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PackageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Package Details
          </Typography>
          <Typography color="text.secondary">
            No package data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <PackageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Package Details
          </Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={onViewDetails}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          {getStatusChip(packageData.status)}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Package Code
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {packageData.packageCode}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Version
            </Typography>
            <Typography variant="body2">
              v{packageData.packageVersion || 1}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Centre
            </Typography>
            <Typography variant="body2">
              {packageData.centreCode} - {packageData.centreName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Candidates
            </Typography>
            <Typography variant="body2">
              {packageData.candidateCount || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Papers
            </Typography>
            <Typography variant="body2">
              {packageData.paperCount || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Package Size
            </Typography>
            <Typography variant="body2">
              {packageData.packageSize ? formatFileSize(packageData.packageSize) : 'N/A'}
            </Typography>
          </Box>

          {packageData.generationTiming?.completedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Generated At
              </Typography>
              <Typography variant="body2">
                {new Date(packageData.generationTiming.completedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {packageData.generationTiming?.totalTimeMs > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Generation Time
              </Typography>
              <Typography variant="body2">
                {packageData.generationTiming.totalTimeMs}ms
              </Typography>
            </Box>
          )}
        </Stack>

        {packageData.validation?.errors?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="error" gutterBottom>
              Validation Errors: {packageData.validation.errors.length}
            </Typography>
          </Box>
        )}

        {packageData.validation?.warnings?.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="warning.main" gutterBottom>
              Validation Warnings: {packageData.validation.warnings.length}
            </Typography>
          </Box>
        )}

        {packageData.notes && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Notes
            </Typography>
            <Typography variant="body2">{packageData.notes}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
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

export default PackageStatusCard;