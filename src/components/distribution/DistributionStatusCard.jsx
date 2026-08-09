/* eslint-disable no-unused-vars */
/**
 * DistributionStatusCard
 * Displays distribution status and information
 * 
 * Location: src/components/distribution/DistributionStatusCard.jsx
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
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  DistributionStatus,
  DistributionStatusLabels,
  DistributionStatusColors,
} from '../../types/distribution.types';

const DistributionStatusCard = ({
  distribution,
  loading = false,
  onRefresh,
  onRevoke,
  onDownload,
  canRevoke = true,
  canDownload = true,
}) => {
  const getStatusChip = (status) => {
    const label = DistributionStatusLabels[status] || status;
    const color = DistributionStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === DistributionStatus.AVAILABLE) {
      icon = <SendIcon />;
    } else if (status === DistributionStatus.DOWNLOADED) {
      icon = <DownloadIcon />;
    } else if (status === DistributionStatus.EXPIRED) {
      icon = <PendingIcon />;
    } else if (status === DistributionStatus.REVOKED) {
      icon = <CancelIcon />;
    } else if (status === DistributionStatus.FAILED) {
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
            <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Distribution Status
          </Typography>
          <LinearProgress />
          <Typography sx={{ mt: 1 }}>Loading distribution...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!distribution) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Distribution Status
          </Typography>
          <Typography color="text.secondary">
            No distribution found
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isAvailable = distribution.status === DistributionStatus.AVAILABLE;
  const isDownloaded = distribution.status === DistributionStatus.DOWNLOADED;
  const isExpired = distribution.status === DistributionStatus.EXPIRED;
  const isRevoked = distribution.status === DistributionStatus.REVOKED;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Distribution Status
          </Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          {getStatusChip(distribution.status)}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Package
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {distribution.packageId?.packageCode || distribution.packageId}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Centre
            </Typography>
            <Typography variant="body2">
              {distribution.centreCode}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              File
            </Typography>
            <Typography variant="body2">
              {distribution.fileName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              File Size
            </Typography>
            <Typography variant="body2">
              {formatFileSize(distribution.fileSize)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Expires At
            </Typography>
            <Typography variant="body2" color={isExpired ? 'error' : 'text.primary'}>
              {new Date(distribution.expiresAt).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Download Count
            </Typography>
            <Typography variant="body2">
              {distribution.downloadCount || 0} / {distribution.maxDownloadAttempts || 5}
            </Typography>
          </Box>

          {isDownloaded && distribution.lastDownloadAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Last Downloaded
              </Typography>
              <Typography variant="body2">
                {new Date(distribution.lastDownloadAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {distribution.tokenExpiresAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Token Expires
              </Typography>
              <Typography variant="body2">
                {new Date(distribution.tokenExpiresAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Actions */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {isAvailable && canDownload && (
            <Chip
              label="Download Package"
              color="primary"
              onClick={onDownload}
              icon={<DownloadIcon />}
              clickable
            />
          )}

          {isAvailable && canRevoke && (
            <Chip
              label="Revoke Distribution"
              color="error"
              onClick={onRevoke}
              icon={<CancelIcon />}
              clickable
            />
          )}

          {isDownloaded && (
            <Chip
              label="Downloaded"
              color="info"
              icon={<DownloadIcon />}
            />
          )}

          {isExpired && (
            <Chip
              label="Expired"
              color="warning"
              icon={<PendingIcon />}
            />
          )}

          {isRevoked && (
            <Chip
              label="Revoked"
              color="error"
              icon={<CancelIcon />}
            />
          )}
        </Box>
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

export default DistributionStatusCard;