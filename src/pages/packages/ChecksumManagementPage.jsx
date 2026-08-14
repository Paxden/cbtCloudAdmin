
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

/**
 * ChecksumManagementPage
 * Main page for managing package checksums and integrity
 * 
 * Location: src/pages/checksum/ChecksumManagementPage.jsx
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
  Fingerprint as FingerprintIcon,
  Verified as VerifiedIcon,
  GppGood as GppGoodIcon,
  GppBad as GppBadIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Hooks
import {
  useChecksum,
  useGenerateChecksum,
  useVerifyChecksum,
} from '../../hooks/useChecksum';

// Import packages hook
import { usePackages } from '../../hooks/usePackage';

// Components
import ChecksumStatusCard from '../../components/checksum/ChecksumStatusCard';
import ChecksumDialog from '../../components/checksum/ChecksumDialog';

// Types
import {
  ChecksumStatus,
  ChecksumStatusLabels,
  ChecksumStatusColors,
} from '../../types/checksum.types';

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ChecksumManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('generate'); // generate, verify
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Hooks for checksum operations
  const { generateChecksum, loading: generating, result: generateResult } = useGenerateChecksum();
  const { verifyChecksum, loading: verifying, result: verifyResult } = useVerifyChecksum();

  // Get checksum status for selected package
  // ✅ Only enable when selectedPackageId is a valid non-null value
  const {
    data: checksumStatus,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useChecksum(
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

  // ✅ Determine checksum status from package data
  const getPackageChecksumStatus = useCallback((pkg) => {
    // Check if package has checksum status from API
    if (pkg.checksumStatus) {
      return pkg.checksumStatus;
    }
    
    // Check package status
    if (pkg.status === 'VERIFIED') {
      return ChecksumStatus.VERIFIED;
    }
    if (pkg.status === 'VALIDATED') {
      return ChecksumStatus.VERIFIED;
    }
    if (pkg.status === 'CHECKSUM_GENERATED') {
      return ChecksumStatus.GENERATED;
    }
    if (pkg.status === 'GENERATING_CHECKSUM') {
      return ChecksumStatus.GENERATING;
    }
    if (pkg.status === 'FAILED') {
      return ChecksumStatus.FAILED;
    }
    if (pkg.status === 'CORRUPTED') {
      return ChecksumStatus.CORRUPTED;
    }
    
    // Default to PENDING for packages that can have checksum generated
    if (pkg.status === 'SIGNED' || pkg.status === 'READY_FOR_CHECKSUM') {
      return ChecksumStatus.PENDING;
    }
    
    return ChecksumStatus.PENDING;
  }, []);

  const getChecksumStatusChip = useCallback((status) => {
    const label = ChecksumStatusLabels[status] || status;
    const color = ChecksumStatusColors[status] || '#9e9e9e';

    let icon = null;
    if (status === ChecksumStatus.VERIFIED) icon = <VerifiedIcon />;
    else if (status === ChecksumStatus.GENERATED) icon = <FingerprintIcon />;
    else if (status === ChecksumStatus.FAILED || status === ChecksumStatus.CORRUPTED) icon = <GppBadIcon />;
    else if (status === ChecksumStatus.GENERATING) icon = <PendingIcon />;

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

  // ✅ Check if package can generate checksum
  const canGenerateChecksum = useCallback((pkg) => {
    const status = getPackageChecksumStatus(pkg);
    return status !== ChecksumStatus.GENERATED && 
           status !== ChecksumStatus.VERIFIED &&
           status !== ChecksumStatus.GENERATING &&
           pkg.status !== 'FAILED' &&
           pkg.status !== 'CORRUPTED';
  }, [getPackageChecksumStatus]);

  // ✅ Check if package can verify checksum
  const canVerifyChecksum = useCallback((pkg) => {
    const status = getPackageChecksumStatus(pkg);
    return status === ChecksumStatus.GENERATED;
  }, [getPackageChecksumStatus]);

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

  const handleGenerate = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await generateChecksum(packageId);
      showSnackbar('Checksum generated successfully!', 'success');
      refetchStatus();
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to generate checksum', 'error');
    }
  }, [generateChecksum, refetchStatus, refetchPackages, showSnackbar]);

  const handleVerify = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await verifyChecksum(packageId);
      showSnackbar('Integrity verified successfully!', 'success');
      refetchStatus();
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to verify integrity', 'error');
    }
  }, [verifyChecksum, refetchStatus, refetchPackages, showSnackbar]);

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
      getPackageChecksumStatus(p) === ChecksumStatus.VERIFIED ||
      p.status === 'VERIFIED' ||
      p.status === 'VALIDATED'
    ).length;
    const generated = packages.filter(p => 
      getPackageChecksumStatus(p) === ChecksumStatus.GENERATED ||
      p.status === 'CHECKSUM_GENERATED'
    ).length;
    const pending = packages.filter(p => 
      getPackageChecksumStatus(p) === ChecksumStatus.PENDING ||
      p.status === 'SIGNED' || 
      p.status === 'READY_FOR_CHECKSUM'
    ).length;
    const failed = packages.filter(p => 
      getPackageChecksumStatus(p) === ChecksumStatus.FAILED || 
      getPackageChecksumStatus(p) === ChecksumStatus.CORRUPTED ||
      p.status === 'FAILED' ||
      p.status === 'CORRUPTED'
    ).length;
    
    return { total, verified, generated, pending, failed };
  }, [packages, getPackageChecksumStatus]);

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
        <Typography color="text.primary">Checksum & Integrity Management</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Checksum & Integrity Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate SHA-256 checksums and verify package integrity
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
                Generated
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {stats.generated}
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
                Failed/Corrupted
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
            const csStatus = getPackageChecksumStatus(pkg);
            const canGenerate = canGenerateChecksum(pkg);
            const canVerify = canVerifyChecksum(pkg);
            
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
                      Checksum Status
                    </Typography>
                    {getChecksumStatusChip(csStatus)}
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

                      {canGenerate && (
                        <Tooltip title="Generate Checksum">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, 'generate')}
                          >
                            <FingerprintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canVerify && (
                        <Tooltip title="Verify Integrity">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, 'verify')}
                          >
                            <VerifiedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {csStatus === ChecksumStatus.VERIFIED && (
                        <Tooltip title="Re-verify">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, 'verify')}
                          >
                            <RefreshIcon fontSize="small" />
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

      {/* Checksum Status Card (when package selected) */}
      {selectedPackageId && selectedPackageId !== 'null' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Checksum Details: {selectedPackageCode}
          </Typography>
          <ChecksumStatusCard
            checksum={checksumStatus}
            loading={statusLoading}
            onRefresh={refetchStatus}
            onGenerate={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'generate')}
            onVerify={() => handleOpenDialog(selectedPackageId, selectedPackageCode, 'verify')}
            canGenerate={checksumStatus?.status !== ChecksumStatus.GENERATED && 
                         checksumStatus?.status !== ChecksumStatus.VERIFIED &&
                         checksumStatus?.status !== ChecksumStatus.GENERATING}
            canVerify={checksumStatus?.status === ChecksumStatus.GENERATED}
          />
        </Box>
      )}

      {/* Checksum Dialog */}
      <ChecksumDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packageId={selectedPackageId}
        packageCode={selectedPackageCode}
        checksumStatus={checksumStatus}
        onGenerate={handleGenerate}
        onVerify={handleVerify}
        loading={generating || verifying}
        error={null}
        result={generateResult || verifyResult}
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
        open={generating || verifying}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {generating ? 'Generating checksum...' : 'Verifying integrity...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default ChecksumManagementPage;