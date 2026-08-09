/* eslint-disable no-unused-vars */
/**
 * ChecksumManagementPage
 * Main page for managing package checksums and integrity
 * 
 * Location: src/pages/checksum/ChecksumManagementPage.jsx
 */

import React, { useState } from 'react';
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

// Components
import ChecksumStatusCard from '../../components/checksum/ChecksumStatusCard';
import ChecksumDialog from '../../components/checksum/ChecksumDialog';

// Types
import {
  ChecksumStatus,
  ChecksumStatusLabels,
  ChecksumStatusColors,
} from '../../types/checksum.types';

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
  const {
    data: checksumStatus,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useChecksum(selectedPackageId, {
    enabled: !!selectedPackageId,
  });

  // Mock packages data - replace with actual API call
  const packages = [
    {
      id: '1',
      packageCode: 'PROMO-2027-ABJ001-V1',
      examName: 'Promotion Examination 2027',
      centreCode: 'ABJ001',
      status: 'SIGNED',
      createdAt: '2026-08-01T21:14:01.468Z',
      checksumStatus: ChecksumStatus.VERIFIED,
    },
    {
      id: '2',
      packageCode: 'PROMO-2027-LAG002-V1',
      examName: 'Promotion Examination 2027',
      centreCode: 'LAG002',
      status: 'SIGNED',
      createdAt: '2026-08-02T10:30:00.000Z',
      checksumStatus: ChecksumStatus.PENDING,
    },
  ];

  // Handlers
  const handleOpenDialog = (packageId, packageCode, mode) => {
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setDialogMode(mode);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (selectedPackageId) {
      refetchStatus();
    }
  };

  const handleGenerate = async (packageId) => {
    try {
      await generateChecksum(packageId);
      showSnackbar('Checksum generated successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to generate checksum', 'error');
    }
  };

  const handleVerify = async (packageId) => {
    try {
      await verifyChecksum(packageId);
      showSnackbar('Integrity verified successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to verify integrity', 'error');
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

  const getChecksumStatusChip = (status) => {
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
    verified: packages.filter(p => p.checksumStatus === ChecksumStatus.VERIFIED).length,
    generated: packages.filter(p => p.checksumStatus === ChecksumStatus.GENERATED).length,
    pending: packages.filter(p => p.checksumStatus === ChecksumStatus.PENDING).length,
    failed: packages.filter(p => p.checksumStatus === ChecksumStatus.FAILED || 
                               p.checksumStatus === ChecksumStatus.CORRUPTED).length,
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
                    Checksum Status
                  </Typography>
                  {getChecksumStatusChip(pkg.checksumStatus)}
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

                    {pkg.checksumStatus !== ChecksumStatus.GENERATED && 
                     pkg.checksumStatus !== ChecksumStatus.VERIFIED && (
                      <Tooltip title="Generate Checksum">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'generate')}
                        >
                          <FingerprintIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(pkg.checksumStatus === ChecksumStatus.GENERATED) && (
                      <Tooltip title="Verify Integrity">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'verify')}
                        >
                          <VerifiedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {pkg.checksumStatus === ChecksumStatus.VERIFIED && (
                      <Tooltip title="Re-verify">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'verify')}
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

      {/* Checksum Status Card */}
      {selectedPackageId && (
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
                         checksumStatus?.status !== ChecksumStatus.VERIFIED}
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