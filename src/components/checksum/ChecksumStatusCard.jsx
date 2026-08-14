/* eslint-disable no-unused-vars */
/**
 * ChecksumStatusCard
 * Displays checksum and integrity status for a package
 * 
 * Location: src/components/checksum/ChecksumStatusCard.jsx
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
  Fingerprint as FingerprintIcon,
  Verified as VerifiedIcon,
  GppGood as GppGoodIcon,
  GppBad as GppBadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';
import {
  ChecksumStatus,
  ChecksumStatusLabels,
  ChecksumStatusColors,
} from '../../types/checksum.types';

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ChecksumStatusCard = ({
  checksum,
  loading = false,
  onRefresh,
  onGenerate,
  onVerify,
  canGenerate = true,
  canVerify = true,
}) => {
  const getStatusChip = (status) => {
    const label = ChecksumStatusLabels[status] || status;
    const color = ChecksumStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === ChecksumStatus.VERIFIED) {
      icon = <VerifiedIcon />;
    } else if (status === ChecksumStatus.GENERATED) {
      icon = <FingerprintIcon />;
    } else if (status === ChecksumStatus.FAILED || status === ChecksumStatus.CORRUPTED) {
      icon = <GppBadIcon />;
    } else if (status === ChecksumStatus.GENERATING) {
      icon = <PendingIcon />;
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
            <FingerprintIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Checksum & Integrity
          </Typography>
          <LinearProgress />
          <Typography sx={{ mt: 1 }}>Loading checksum status...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!checksum) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FingerprintIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Checksum & Integrity
          </Typography>
          <Typography color="text.secondary">
            No checksum data available
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Generate a checksum to enable integrity verification
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isGenerated = checksum.status === ChecksumStatus.GENERATED || 
                      checksum.status === ChecksumStatus.VERIFIED;
  const isVerified = checksum.status === ChecksumStatus.VERIFIED;
  const isCorrupted = checksum.status === ChecksumStatus.CORRUPTED;
  const isFailed = checksum.status === ChecksumStatus.FAILED;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <FingerprintIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Checksum & Integrity
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
          {getStatusChip(checksum.status)}
        </Box>

        {checksum.fingerprint && (
          <Box sx={{ mb: 2 }}>
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Fingerprint
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
                  {checksum.fingerprint}
                </Typography>
              </Box>
              {checksum.shortFingerprint && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: 'monospace', display: 'block', mt: 0.5 }}
                >
                  Short: {checksum.shortFingerprint}
                </Typography>
              )}
            </Paper>
          </Box>
        )}

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Algorithm
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {checksum.algorithm || 'SHA-256'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Version
            </Typography>
            <Typography variant="body2">
              {checksum.checksumVersion || '1.0.0'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              File Count
            </Typography>
            <Typography variant="body2">
              {checksum.fileCount || 0}
            </Typography>
          </Box>

          {checksum.packageSize > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Package Size
              </Typography>
              <Typography variant="body2">
                {formatFileSize(checksum.packageSize)}
              </Typography>
            </Box>
          )}

          {checksum.generatedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Generated At
              </Typography>
              <Typography variant="body2">
                {new Date(checksum.generatedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {checksum.generatedBy && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Generated By
              </Typography>
              <Typography variant="body2">
                {/* ✅ FIX: Handle object or string */}
                {typeof checksum.generatedBy === 'string' 
                  ? checksum.generatedBy 
                  : checksum.generatedBy?.name || 
                    checksum.generatedBy?.email || 
                    checksum.generatedBy?.fullName || 
                    checksum.generatedBy?.id ||
                    'Unknown'}
              </Typography>
            </Box>
          )}

          {isVerified && checksum.verifiedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Verified At
              </Typography>
              <Typography variant="body2" color="success.main">
                {new Date(checksum.verifiedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {isCorrupted && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Integrity Status
              </Typography>
              <Typography variant="body2" color="error.main">
                ❌ Corrupted - Integrity check failed
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Actions */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isGenerated && checksum.status !== ChecksumStatus.GENERATING && canGenerate && (
            <Chip
              label="Generate Checksum"
              color="primary"
              onClick={onGenerate}
              icon={<FingerprintIcon />}
              clickable
            />
          )}

          {isGenerated && !isVerified && !isCorrupted && !isFailed && canVerify && (
            <Chip
              label="Verify Integrity"
              color="success"
              onClick={onVerify}
              icon={<VerifiedIcon />}
              clickable
            />
          )}

          {isVerified && (
            <Chip
              label="✅ Integrity Verified"
              color="success"
              icon={<CheckCircleIcon />}
            />
          )}

          {isCorrupted && (
            <Chip
              label="⚠️ Integrity Check Failed"
              color="error"
              icon={<GppBadIcon />}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChecksumStatusCard;