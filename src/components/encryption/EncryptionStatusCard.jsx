/* eslint-disable no-unused-vars */
/**
 * EncryptionStatusCard
 * Displays encryption status for a package
 * 
 * Location: src/components/encryption/EncryptionStatusCard.jsx
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
} from '@mui/material';
import {
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import {
  EncryptionStatus,
  EncryptionStatusLabels,
  EncryptionStatusColors,
  AssetTypeLabels,
} from '../../types/encryption.types';

const EncryptionStatusCard = ({
  status,
  loading = false,
  onRefresh,
  onEncrypt,
  onReEncrypt,
  onDecryptAsset,
  canEncrypt = true,
  canReEncrypt = true,
  canDecrypt = true,
}) => {
  const getStatusChip = (status) => {
    const label = EncryptionStatusLabels[status] || status;
    const color = EncryptionStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === EncryptionStatus.ENCRYPTED) {
      icon = <LockIcon />;
    } else if (status === EncryptionStatus.PENDING) {
      icon = <PendingIcon />;
    } else if (status === EncryptionStatus.FAILED) {
      icon = <ErrorIcon />;
    } else if (status === EncryptionStatus.DECRYPTED) {
      icon = <LockOpenIcon />;
    } else if (status === EncryptionStatus.ENCRYPTING) {
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
            <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Encryption Status
          </Typography>
          <LinearProgress />
          <Typography sx={{ mt: 1 }}>Loading encryption status...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Encryption Status
          </Typography>
          <Typography color="text.secondary">
            No encryption data available
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Encrypt the package to generate encryption data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isEncrypted = status.status === EncryptionStatus.ENCRYPTED;
  const isFailed = status.status === EncryptionStatus.FAILED;
  const isPending = status.status === EncryptionStatus.PENDING || 
                    status.status === EncryptionStatus.ENCRYPTING;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Encryption Status
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
          {getStatusChip(status.status)}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Algorithm
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {status.algorithm || 'AES-256-GCM'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Version
            </Typography>
            <Typography variant="body2">
              {status.encryptionVersion || '1.0.0'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Encrypted Files
            </Typography>
            <Typography variant="body2">
              {status.encryptedFiles || 0}
            </Typography>
          </Box>

          {status.totalEncryptedSize > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Total Size
              </Typography>
              <Typography variant="body2">
                {formatFileSize(status.totalEncryptedSize)}
              </Typography>
            </Box>
          )}

          {status.encryptedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Encrypted At
              </Typography>
              <Typography variant="body2">
                {new Date(status.encryptedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {status.encryptedBy && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Encrypted By
              </Typography>
              <Typography variant="body2">
                {status.encryptedBy}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Actions */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isEncrypted && !isPending && canEncrypt && (
            <Chip
              label="Encrypt Package"
              color="primary"
              onClick={onEncrypt}
              icon={<LockIcon />}
              clickable
            />
          )}

          {isEncrypted && canReEncrypt && (
            <Chip
              label="Re-encrypt (Key Rotation)"
              color="warning"
              onClick={onReEncrypt}
              icon={<SecurityIcon />}
              clickable
            />
          )}

          {isEncrypted && canDecrypt && (
            <Chip
              label="Decrypt Assets"
              color="info"
              onClick={onDecryptAsset}
              icon={<LockOpenIcon />}
              clickable
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

export default EncryptionStatusCard;