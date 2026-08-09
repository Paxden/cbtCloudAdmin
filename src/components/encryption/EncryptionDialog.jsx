/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * EncryptionDialog
 * Dialog for encrypting/decrypting packages
 * 
 * Location: src/components/encryption/EncryptionDialog.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { AssetTypes, AssetTypeLabels } from '../../types/encryption.types';

const EncryptionDialog = ({
  open,
  onClose,
  packageId,
  packageCode,
  encryptionStatus,
  onEncrypt,
  onReEncrypt,
  onDecrypt,
  loading = false,
  error = null,
  result = null,
  mode = 'encrypt', // encrypt, re-encrypt, decrypt
}) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [decryptResult, setDecryptResult] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedAsset('');
      setDecryptResult(null);
    }
  }, [open]);

  const handleDecrypt = () => {
    if (selectedAsset) {
      onDecrypt(packageId, selectedAsset);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'encrypt':
        return 'Encrypt Package';
      case 're-encrypt':
        return 'Re-encrypt Package (Key Rotation)';
      case 'decrypt':
        return 'Decrypt Package Asset';
      default:
        return 'Encryption Operation';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'encrypt':
        return <LockIcon />;
      case 're-encrypt':
        return <SecurityIcon />;
      case 'decrypt':
        return <LockOpenIcon />;
      default:
        return <LockIcon />;
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'encrypt':
        return 'This will encrypt all sensitive assets in the package using AES-256-GCM encryption.';
      case 're-encrypt':
        return 'This will re-encrypt the package with a new encryption key (key rotation).';
      case 'decrypt':
        return 'Select an asset to decrypt for verification purposes.';
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
            {mode === 'encrypt' ? 'Encrypting package...' : 
             mode === 're-encrypt' ? 'Re-encrypting package...' : 
             'Decrypting asset...'}
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
      return (
        <Box>
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
            {mode === 'encrypt' ? 'Package encrypted successfully!' : 
             mode === 're-encrypt' ? 'Package re-encrypted successfully!' : 
             'Asset decrypted successfully!'}
          </Alert>

          {mode === 'decrypt' && result.decryptedData && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Decrypted Data Preview
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  maxHeight: 300,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {typeof result.decryptedData === 'string' 
                  ? result.decryptedData 
                  : JSON.stringify(result.decryptedData, null, 2)}
              </Box>
            </Box>
          )}

          {mode !== 'decrypt' && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Encrypted Files
                </Typography>
                <Typography variant="body2">{result.encryptedFileCount || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Size
                </Typography>
                <Typography variant="body2">
                  {result.totalEncryptedSize 
                    ? `${(result.totalEncryptedSize / 1024).toFixed(2)} KB` 
                    : '0 B'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Algorithm
                </Typography>
                <Typography variant="body2">{result.algorithm || 'AES-256-GCM'}</Typography>
              </Box>
            </Stack>
          )}

          {mode === 'decrypt' && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Asset Type
                </Typography>
                <Typography variant="body2">
                  {AssetTypeLabels[result.assetType] || result.assetType}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  File Name
                </Typography>
                <Typography variant="body2">{result.fileName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  File Size
                </Typography>
                <Typography variant="body2">
                  {result.fileSize ? `${(result.fileSize / 1024).toFixed(2)} KB` : '0 B'}
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>
      );
    }

    // Form for decrypt mode
    if (mode === 'decrypt') {
      // Get available assets from encryption status
      const availableAssets = encryptionStatus?.encryptedFiles?.map(f => f.assetType) || [];
      
      return (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            {getDescription()}
          </Alert>

          <FormControl fullWidth>
            <InputLabel>Select Asset to Decrypt</InputLabel>
            <Select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              label="Select Asset to Decrypt"
            >
              {availableAssets.length === 0 ? (
                <MenuItem value="" disabled>
                  No encrypted assets available
                </MenuItem>
              ) : (
                availableAssets.map((asset) => (
                  <MenuItem key={asset} value={asset}>
                    {AssetTypeLabels[asset] || asset}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
      );
    }

    // Encrypt/Re-encrypt confirmation
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
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
              label={encryptionStatus?.status || 'Not Encrypted'}
              size="small"
              color={encryptionStatus?.status === 'ENCRYPTED' ? 'success' : 'default'}
            />
          </Box>
        </Stack>

        {mode === 're-encrypt' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This will generate a new encryption key and re-encrypt all assets.
            Previous encryption will be archived.
          </Alert>
        )}
      </Box>
    );
  };

  const canSubmit = () => {
    if (mode === 'decrypt') {
      return !!selectedAsset && !loading && !result;
    }
    return !loading && !result;
  };

  const getSubmitLabel = () => {
    if (loading) return 'Processing...';
    if (result) return 'Done';
    switch (mode) {
      case 'encrypt': return 'Encrypt Package';
      case 're-encrypt': return 'Re-encrypt Package';
      case 'decrypt': return 'Decrypt Asset';
      default: return 'Submit';
    }
  };

  const getSubmitColor = () => {
    switch (mode) {
      case 'encrypt': return 'primary';
      case 're-encrypt': return 'warning';
      case 'decrypt': return 'info';
      default: return 'primary';
    }
  };

  const handleSubmit = () => {
    if (mode === 'encrypt') {
      onEncrypt(packageId);
    } else if (mode === 're-encrypt') {
      onReEncrypt(packageId);
    } else if (mode === 'decrypt') {
      handleDecrypt();
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
            color={getSubmitColor()}
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

export default EncryptionDialog;