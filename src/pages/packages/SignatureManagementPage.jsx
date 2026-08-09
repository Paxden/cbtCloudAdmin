/* eslint-disable no-unused-vars */
/**
 * SignatureManagementPage
 * Main page for managing package digital signatures
 * 
 * Location: src/pages/signature/SignatureManagementPage.jsx
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

// Components
import SignatureStatusCard from '../../components/signature/SignatureStatusCard';
import SignatureDialog from '../../components/signature/SignatureDialog';

// Types
import {
  SignatureStatus,
  SignatureStatusLabels,
  SignatureStatusColors,
} from '../../types/signature.types';

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
  const {
    data: signatureStatus,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useSignature(selectedPackageId, {
    enabled: !!selectedPackageId,
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
      signatureStatus: SignatureStatus.VERIFIED,
    },
    {
      id: '2',
      packageCode: 'PROMO-2027-LAG002-V1',
      examName: 'Promotion Examination 2027',
      centreCode: 'LAG002',
      status: 'ENCRYPTED',
      createdAt: '2026-08-02T10:30:00.000Z',
      signatureStatus: SignatureStatus.PENDING,
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

  const handleSign = async (packageId) => {
    try {
      await signPackage(packageId);
      showSnackbar('Package signed successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to sign package', 'error');
    }
  };

  const handleVerify = async (packageId) => {
    try {
      await verifySignature(packageId);
      showSnackbar('Signature verified successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to verify signature', 'error');
    }
  };

  const handleRevoke = async (packageId, reason) => {
    try {
      await revokeSignature(packageId, reason);
      showSnackbar('Signature revoked successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to revoke signature', 'error');
    }
  };

  const handleRegenerate = async (packageId) => {
    try {
      await regenerateSignature(packageId);
      showSnackbar('Signature regenerated successfully!', 'success');
      refetchStatus();
    } catch (error) {
      showSnackbar(error.message || 'Failed to regenerate signature', 'error');
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

  const getSignatureStatusChip = (status) => {
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
    verified: packages.filter(p => p.signatureStatus === SignatureStatus.VERIFIED).length,
    signed: packages.filter(p => p.signatureStatus === SignatureStatus.SIGNED).length,
    pending: packages.filter(p => p.signatureStatus === SignatureStatus.PENDING).length,
    revoked: packages.filter(p => p.signatureStatus === SignatureStatus.REVOKED).length,
    failed: packages.filter(p => p.signatureStatus === SignatureStatus.FAILED).length,
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
                    Signature Status
                  </Typography>
                  {getSignatureStatusChip(pkg.signatureStatus)}
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

                    {pkg.signatureStatus !== SignatureStatus.SIGNED && 
                     pkg.signatureStatus !== SignatureStatus.VERIFIED && (
                      <Tooltip title="Sign">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'sign')}
                        >
                          <GppGoodIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {pkg.signatureStatus === SignatureStatus.SIGNED && (
                      <Tooltip title="Verify">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'verify')}
                        >
                          <VerifiedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(pkg.signatureStatus === SignatureStatus.SIGNED || 
                      pkg.signatureStatus === SignatureStatus.VERIFIED) && (
                      <>
                        <Tooltip title="Regenerate">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'regenerate')}
                          >
                            <ReplayIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Revoke">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog(pkg.id, pkg.packageCode, 'revoke')}
                          >
                            <CancelIcon fontSize="small" />
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

      {/* Signature Status Card */}
      {selectedPackageId && (
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
                     signatureStatus?.status !== SignatureStatus.VERIFIED}
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