/* eslint-disable no-unused-vars */
/**
 * EncryptionManagementPage
 * Main page for managing package encryption
 * 
 * Location: src/pages/encryption/EncryptionManagementPage.jsx
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Hooks
import {
  useEncryptionStatus,
  useEncryptPackage,
  useReEncryptPackage,
  useDecryptAsset,
} from '../../hooks/useEncryption';

// Components
import EncryptionStatusCard from '../../components/encryption/EncryptionStatusCard';
import EncryptionDialog from '../../components/encryption/EncryptionDialog';

// Types
import {
  EncryptionStatus,
  EncryptionStatusLabels,
  EncryptionStatusColors,
} from '../../types/encryption.types';

const EncryptionManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('encrypt'); // encrypt, re-encrypt, decrypt
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Hooks for encryption operations
  const { encryptPackage, loading: encrypting, result: encryptResult } = useEncryptPackage();
  const { reEncryptPackage, loading: reEncrypting, result: reEncryptResult } = useReEncryptPackage();
  const { decryptAsset, loading: decrypting, result: decryptResult } = useDecryptAsset();

  // Get encryption status for selected package
  const {
    data: encryptionStatus,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
    startPolling,
    stopPolling,
    isPolling,
  } = useEncryptionStatus(selectedPackageId, {
    enabled: !!selectedPackageId,
    autoPoll: false,
  });

  // Mock packages data - replace with actual API call
  const packages = [
    {
      id: '1',
      packageCode: 'PROMO-2027-ABJ001-V1',
      examName: 'Promotion Examination 2027',
      centreCode: 'ABJ001',
      status: 'ENCRYPTED',
      createdAt: '2026-08-01T21:14:01.468Z',
      encryptionStatus: EncryptionStatus.ENCRYPTED,
    },
    {
      id: '2',
      packageCode: 'PROMO-2027-LAG002-V1',
      examName: 'Promotion Examination 2027',
      centreCode: 'LAG002',
      status: 'GENERATED',
      createdAt: '2026-08-02T10:30:00.000Z',
      encryptionStatus: EncryptionStatus.PENDING,
    },
  ];

  // Handlers
  const handleOpenDialog = (packageId, packageCode, mode) => {
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setDialogMode(mode);
    setDialogOpen(true);
    // Start polling for status updates when encrypting
    if (mode === 'encrypt' || mode === 're-encrypt') {
      startPolling(3000);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    stopPolling();
    // Refresh status after closing
    if (selectedPackageId) {
      refetchStatus();
    }
  };

  const handleEncrypt = async (packageId) => {
    try {
      await encryptPackage(packageId);
      showSnackbar('Package encrypted successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to encrypt package', 'error');
    }
  };

  const handleReEncrypt = async (packageId) => {
    try {
      await reEncryptPackage(packageId);
      showSnackbar('Package re-encrypted successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to re-encrypt package', 'error');
    }
  };

  const handleDecrypt = async (packageId, assetType) => {
    try {
      await decryptAsset(packageId, assetType);
      showSnackbar('Asset decrypted successfully!', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to decrypt asset', 'error');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  };

  const handleViewPackage = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  const getEncryptionStatusChip = (status) => {
    const label = EncryptionStatusLabels[status] || status;
    const color = EncryptionStatusColors[status] || '#9e9e9e';

    let icon = null;
    if (status === EncryptionStatus.ENCRYPTED) icon = <LockIcon />;
    else if (status === EncryptionStatus.PENDING) icon = <PendingIcon />;
    else if (status === EncryptionStatus.FAILED) icon = <ErrorIcon />;
    else if (status === EncryptionStatus.DECRYPTED) icon = <LockOpenIcon />;

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

  // Filter packages
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.packageCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.centreCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const stats = {
    total: packages.length,
    encrypted: packages.filter(p => p.encryptionStatus === EncryptionStatus.ENCRYPTED).length,
    pending: packages.filter(p => p.encryptionStatus === EncryptionStatus.PENDING).length,
    failed: packages.filter(p => p.encryptionStatus === EncryptionStatus.FAILED).length,
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
        >
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/packages');
          }}
        >
          Packages
        </Link>
        <Typography color="text.primary">Encryption Management</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Encryption Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage encryption for examination packages using AES-256-GCM
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => {
            if (selectedPackageId) {
              refetchStatus();
            }
            showSnackbar('Refreshed successfully', 'success');
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Total Packages
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Encrypted
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.encrypted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Pending
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Failed
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.failed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search packages by code, exam name, or centre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Package List */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Packages</Typography>
        </Box>

        {filteredPackages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No packages match your search' : 'No packages found'}
            </Typography>
          </Box>
        ) : (
          filteredPackages.map((pkg) => (
            <Box
              key={pkg.id}
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {pkg.packageCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pkg.examName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Centre: {pkg.centreCode}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {new Date(pkg.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Encryption Status
                  </Typography>
                  {getEncryptionStatusChip(pkg.encryptionStatus)}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Actions
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Package">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPackage(pkg.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {pkg.encryptionStatus !== EncryptionStatus.ENCRYPTED && (
                      <Tooltip title="Encrypt">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'encrypt')}
                        >
                          <LockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {pkg.encryptionStatus === EncryptionStatus.ENCRYPTED && (
                      <>
                        <Tooltip title="Re-encrypt (Key Rotation)">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 're-encrypt')}
                          >
                            <ReplayIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Decrypt Asset">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'decrypt')}
                          >
                            <LockOpenIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      setSelectedPackageCode(pkg.packageCode);
                      refetchStatus();
                    }}
                  >
                    Check Status
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Paper>

      {/* Encryption Status Card (when package selected) */}
      {selectedPackageId && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Encryption Details: {selectedPackageCode}
          </Typography>
          <EncryptionStatusCard
            status={encryptionStatus}
            loading={statusLoading}
            onRefresh={refetchStatus}
            onEncrypt={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'encrypt')}
            onReEncrypt={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 're-encrypt')}
            onDecryptAsset={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'decrypt')}
            canEncrypt={encryptionStatus?.status !== EncryptionStatus.ENCRYPTED}
            canReEncrypt={encryptionStatus?.status === EncryptionStatus.ENCRYPTED}
            canDecrypt={encryptionStatus?.status === EncryptionStatus.ENCRYPTED}
          />
        </Box>
      )}

      {/* Encryption Dialog */}
      <EncryptionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packageId={selectedPackageId}
        packageCode={selectedPackageCode}
        encryptionStatus={encryptionStatus}
        onEncrypt={handleEncrypt}
        onReEncrypt={handleReEncrypt}
        onDecrypt={handleDecrypt}
        loading={encrypting || reEncrypting || decrypting}
        error={null}
        result={encryptResult || reEncryptResult || decryptResult}
        mode={dialogMode}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Backdrop for loading */}
      <Backdrop
        open={encrypting || reEncrypting || decrypting}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {encrypting ? 'Encrypting package...' : 
             reEncrypting ? 'Re-encrypting package...' : 
             decrypting ? 'Decrypting asset...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default EncryptionManagementPage;