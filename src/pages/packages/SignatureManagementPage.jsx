
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/**
 * SignatureManagementPage
 * Main page for managing package digital signatures
 * 
 * Location: src/pages/signature/SignatureManagementPage.jsx
 */

import React, { useState, useMemo, useCallback } from 'react';
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
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Verified as VerifiedIcon,
  GppGood as GppGoodIcon,
  GppBad as GppBadIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Hooks
import {
  useSignature,
  useSignPackage,
  useVerifySignature,
  useRevokeSignature,
  useRegenerateSignature,
} from '../../hooks/useSignature';

// Import packages hook
import { usePackages } from '../../hooks/usePackage';

// Components
import SignatureStatusCard from '../../components/signature/SignatureStatusCard';
import SignatureDialog from '../../components/signature/SignatureDialog';

// Types
import {
  SignatureStatus,
  SignatureStatusLabels,
  SignatureStatusColors,
} from '../../types/signature.types';

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const SignatureManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('sign'); // sign, verify, revoke, regenerate
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Hooks for signature operations
  const { signPackage, loading: signing, result: signResult } = useSignPackage();
  const { verifySignature, loading: verifying, result: verifyResult } = useVerifySignature();
  const { revokeSignature, loading: revoking, result: revokeResult } = useRevokeSignature();
  const { regenerateSignature, loading: regenerating, result: regenerateResult } = useRegenerateSignature();

  // Get signature status for selected package
  // ✅ Only enable when selectedPackageId is a valid non-null value
  const {
    data: signatureStatus,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useSignature(
    selectedPackageId && selectedPackageId !== 'null' ? selectedPackageId : null,
    {
      enabled: !!selectedPackageId && selectedPackageId !== 'null' && selectedPackageId !== null,
    }
  );

  // ✅ Memoize filter params to prevent infinite re-renders
  const packageParams = useMemo(() => ({
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
  }), [searchQuery]);

  // Get packages with memoized params
  const {
    data: packagesData,
    loading: packagesLoading,
    error: packagesError,
    refetch: refetchPackages,
  } = usePackages(packageParams);

  const packages = packagesData?.data || [];

  // ============================================================
  // ✅ HELPER FUNCTIONS (defined first)
  // ============================================================

  // ✅ Determine signature status from package data
  const getPackageSignatureStatus = useCallback((pkg) => {
    // Check if package has signature status from API
    if (pkg.signatureStatus) {
      return pkg.signatureStatus;
    }
    
    // Check package status
    if (pkg.status === 'VERIFIED') {
      return SignatureStatus.VERIFIED;
    }
    if (pkg.status === 'SIGNED') {
      return SignatureStatus.SIGNED;
    }
    if (pkg.status === 'SIGNING') {
      return SignatureStatus.SIGNING;
    }
    if (pkg.status === 'REVOKED') {
      return SignatureStatus.REVOKED;
    }
    if (pkg.status === 'FAILED') {
      return SignatureStatus.FAILED;
    }
    
    // Default to PENDING for packages that can be signed
    if (pkg.status === 'ENCRYPTED' || pkg.status === 'READY_FOR_SIGNATURE') {
      return SignatureStatus.PENDING;
    }
    
    return SignatureStatus.PENDING;
  }, []);

  const getSignatureStatusChip = useCallback((status) => {
    const label = SignatureStatusLabels[status] || status;
    const color = SignatureStatusColors[status] || '#9e9e9e';

    let icon = null;
    if (status === SignatureStatus.VERIFIED) icon = <VerifiedIcon />;
    else if (status === SignatureStatus.SIGNED) icon = <GppGoodIcon />;
    else if (status === SignatureStatus.FAILED) icon = <GppBadIcon />;
    else if (status === SignatureStatus.REVOKED) icon = <CancelIcon />;
    else if (status === SignatureStatus.SIGNING) icon = <PendingIcon />;

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
  }, []);

  // ✅ Check if package can be signed
  const canSignPackage = useCallback((pkg) => {
    const status = getPackageSignatureStatus(pkg);
    return status !== SignatureStatus.SIGNED && 
           status !== SignatureStatus.VERIFIED &&
           status !== SignatureStatus.SIGNING &&
           pkg.status !== 'REVOKED' &&
           pkg.status !== 'FAILED';
  }, [getPackageSignatureStatus]);

  // ✅ Check if package can be verified
  const canVerifyPackage = useCallback((pkg) => {
    const status = getPackageSignatureStatus(pkg);
    return status === SignatureStatus.SIGNED;
  }, [getPackageSignatureStatus]);

  // ✅ Check if package can be revoked
  const canRevokePackage = useCallback((pkg) => {
    const status = getPackageSignatureStatus(pkg);
    return (status === SignatureStatus.SIGNED || 
            status === SignatureStatus.VERIFIED) &&
            pkg.status !== 'REVOKED';
  }, [getPackageSignatureStatus]);

  // ✅ Check if package can be regenerated
  const canRegeneratePackage = useCallback((pkg) => {
    const status = getPackageSignatureStatus(pkg);
    return (status === SignatureStatus.SIGNED || 
            status === SignatureStatus.VERIFIED) &&
            pkg.status !== 'REVOKED';
  }, [getPackageSignatureStatus]);

  // ============================================================
  // ✅ SNACKBAR FUNCTIONS (defined before being used)
  // ============================================================

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  }, []);

  // ============================================================
  // ✅ HANDLERS (defined after showSnackbar)
  // ============================================================

  const handleOpenDialog = useCallback((packageId, packageCode, mode) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setDialogMode(mode);
    setDialogOpen(true);
  }, [showSnackbar]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    if (selectedPackageId && selectedPackageId !== 'null') {
      refetchStatus();
    }
    refetchPackages();
  }, [selectedPackageId, refetchStatus, refetchPackages]);

  const handleSign = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await signPackage(packageId);
      showSnackbar('Package signed successfully!', 'success');
      refetchStatus();
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to sign package', 'error');
    }
  }, [signPackage, refetchStatus, refetchPackages, showSnackbar]);

  const handleVerify = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await verifySignature(packageId);
      showSnackbar('Signature verified successfully!', 'success');
      refetchStatus();
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to verify signature', 'error');
    }
  }, [verifySignature, refetchStatus, refetchPackages, showSnackbar]);

  const handleRevoke = useCallback(async (packageId, reason) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await revokeSignature(packageId, reason);
      showSnackbar('Signature revoked successfully!', 'success');
      refetchStatus();
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to revoke signature', 'error');
    }
  }, [revokeSignature, refetchStatus, refetchPackages, showSnackbar]);

  const handleRegenerate = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await regenerateSignature(packageId);
      showSnackbar('Signature regenerated successfully!', 'success');
      refetchStatus();
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to regenerate signature', 'error');
    }
  }, [regenerateSignature, refetchStatus, refetchPackages, showSnackbar]);

  const handleViewPackage = useCallback((packageId) => {
    navigate(`/packages/${packageId}`);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    if (selectedPackageId && selectedPackageId !== 'null') {
      refetchStatus();
    }
    refetchPackages();
    showSnackbar('Refreshed successfully', 'success');
  }, [selectedPackageId, refetchStatus, refetchPackages, showSnackbar]);

  const handleCheckStatus = useCallback((packageId, packageCode) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    refetchStatus();
  }, [refetchStatus, showSnackbar]);

  // ============================================================
  // ✅ STATISTICS
  // ============================================================

  const stats = useMemo(() => {
    const total = packages.length;
    const verified = packages.filter(p => 
      getPackageSignatureStatus(p) === SignatureStatus.VERIFIED ||
      p.status === 'VERIFIED'
    ).length;
    const signed = packages.filter(p => 
      getPackageSignatureStatus(p) === SignatureStatus.SIGNED ||
      p.status === 'SIGNED'
    ).length;
    const pending = packages.filter(p => 
      getPackageSignatureStatus(p) === SignatureStatus.PENDING ||
      p.status === 'ENCRYPTED' || 
      p.status === 'READY_FOR_SIGNATURE'
    ).length;
    const revoked = packages.filter(p => 
      getPackageSignatureStatus(p) === SignatureStatus.REVOKED ||
      p.status === 'REVOKED'
    ).length;
    const failed = packages.filter(p => 
      getPackageSignatureStatus(p) === SignatureStatus.FAILED ||
      p.status === 'FAILED'
    ).length;
    
    return { total, verified, signed, pending, revoked, failed };
  }, [packages, getPackageSignatureStatus]);

  // ============================================================
  // ✅ RENDER
  // ============================================================

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
        <Typography color="text.primary">Digital Signature Management</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Digital Signature Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage Ed25519 digital signatures for examination packages
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={packagesLoading}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
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
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Verified
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.verified}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Signed
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {stats.signed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
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
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Revoked/Failed
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.revoked + stats.failed}
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

        {packagesLoading && packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading packages...</Typography>
          </Box>
        ) : packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No packages match your search' : 'No packages found'}
            </Typography>
          </Box>
        ) : (
          packages.map((pkg) => {
            const sigStatus = getPackageSignatureStatus(pkg);
            const canSign = canSignPackage(pkg);
            const canVerify = canVerifyPackage(pkg);
            const canRevoke = canRevokePackage(pkg);
            const canRegenerate = canRegeneratePackage(pkg);
            
            return (
              <Box
                key={pkg._id}
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
                      {pkg.examInfo?.examName || 'N/A'}
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
                      {new Date(pkg.createdAt || pkg.generationTiming?.completedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Signature Status
                    </Typography>
                    {getSignatureStatusChip(sigStatus)}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Actions
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Package">
                        <IconButton
                          size="small"
                          onClick={() => handleViewPackage(pkg._id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {canSign && (
                        <Tooltip title="Sign Package">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, 'sign')}
                          >
                            <GppGoodIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canVerify && (
                        <Tooltip title="Verify Signature">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, 'verify')}
                          >
                            <VerifiedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canRevoke && (
                        <Tooltip title="Revoke Signature">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, 'revoke')}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canRegenerate && (
                        <Tooltip title="Regenerate Signature">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, 'regenerate')}
                          >
                            <ReplayIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleCheckStatus(pkg._id, pkg.packageCode)}
                      disabled={!pkg._id || pkg._id === 'null'}
                    >
                      Check Status
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            );
          })
        )}
      </Paper>

      {/* Signature Status Card (when package selected) */}
      {selectedPackageId && selectedPackageId !== 'null' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Signature Details: {selectedPackageCode}
          </Typography>
          <SignatureStatusCard
            signature={signatureStatus}
            loading={statusLoading}
            onRefresh={refetchStatus}
            onSign={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'sign')}
            onVerify={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'verify')}
            onRevoke={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'revoke')}
            onRegenerate={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'regenerate')}
            canSign={signatureStatus?.status !== SignatureStatus.SIGNED && 
                     signatureStatus?.status !== SignatureStatus.VERIFIED &&
                     signatureStatus?.status !== SignatureStatus.SIGNING}
            canVerify={signatureStatus?.status === SignatureStatus.SIGNED}
            canRevoke={signatureStatus?.status === SignatureStatus.SIGNED || 
                       signatureStatus?.status === SignatureStatus.VERIFIED}
            canRegenerate={signatureStatus?.status === SignatureStatus.SIGNED || 
                          signatureStatus?.status === SignatureStatus.VERIFIED}
          />
        </Box>
      )}

      {/* Signature Dialog */}
      <SignatureDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packageId={selectedPackageId}
        packageCode={selectedPackageCode}
        signatureStatus={signatureStatus}
        onSign={handleSign}
        onVerify={handleVerify}
        onRevoke={handleRevoke}
        onRegenerate={handleRegenerate}
        loading={signing || verifying || revoking || regenerating}
        error={null}
        result={signResult || verifyResult || revokeResult || regenerateResult}
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
        open={signing || verifying || revoking || regenerating}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {signing ? 'Signing package...' : 
             verifying ? 'Verifying signature...' : 
             revoking ? 'Revoking signature...' : 
             regenerating ? 'Regenerating signature...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default SignatureManagementPage;