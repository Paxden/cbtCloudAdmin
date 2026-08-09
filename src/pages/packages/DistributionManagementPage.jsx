/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/**
 * DistributionManagementPage
 * Main page for managing package distributions
 * 
 * Location: src/pages/distribution/DistributionManagementPage.jsx
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
  Send as SendIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Hooks
import {
  useDistributions,
  useCreateDistribution,
  useRevokeDistribution,
} from '../../hooks/useDistribution';

// Components
import DistributionDialog from '../../components/distribution/DistributionDialog';
import DistributionStatusCard from '../../components/distribution/DistributionStatusCard';

// Types
import {
  DistributionStatus,
  DistributionStatusLabels,
  DistributionStatusColors,
} from '../../types/distribution.types';

const DistributionManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistributionId, setSelectedDistributionId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');

  // Hooks for distribution operations
  const { createDistribution, loading: creating, result: createResult } = useCreateDistribution();
  const { revokeDistribution, loading: revoking, result: revokeResult } = useRevokeDistribution();

  // ✅ MEMOIZE FILTER PARAMS - This prevents infinite re-renders
  const distributionParams = useMemo(() => ({
    page: page + 1,
    limit,
    search: searchQuery || undefined,
    status: statusFilter || undefined,
  }), [page, limit, searchQuery, statusFilter]);

  // Get distributions with memoized params
  const {
    data: distributionsData,
    loading: distributionsLoading,
    error: distributionsError,
    refetch: refetchDistributions,
  } = useDistributions(distributionParams);

  // Mock packages and centres for dialog
  const mockPackages = useMemo(() => [
    { _id: '1', packageCode: 'PROMO-2027-ABJ001-V1', centreCode: 'ABJ001' },
    { _id: '2', packageCode: 'PROMO-2027-LAG002-V1', centreCode: 'LAG002' },
  ], []);

  const mockCentres = useMemo(() => [
    { _id: '1', code: 'ABJ001', name: 'Abuja Test Centre' },
    { _id: '2', code: 'LAG002', name: 'Lagos Test Centre' },
  ], []);

  // Handlers
  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    refetchDistributions();
  }, [refetchDistributions]);

  const handleCreateDistribution = useCallback(async (data) => {
    try {
      await createDistribution(data);
      showSnackbar('Distribution created successfully!', 'success');
      refetchDistributions();
    } catch (error) {
      showSnackbar(error.message || 'Failed to create distribution', 'error');
    }
  }, [createDistribution, refetchDistributions]);

  const handleRevokeDistribution = useCallback(async (distributionId, reason = '') => {
    try {
      await revokeDistribution(distributionId, reason);
      showSnackbar('Distribution revoked successfully!', 'success');
      refetchDistributions();
    } catch (error) {
      showSnackbar(error.message || 'Failed to revoke distribution', 'error');
    }
  }, [revokeDistribution, refetchDistributions]);

  const handleDownload = useCallback(async (distributionId) => {
    try {
      // Implement download logic
      showSnackbar('Download started', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to download', 'error');
    }
  }, []);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  }, []);

  const getDistributionStatusChip = useCallback((status) => {
    const label = DistributionStatusLabels[status] || status;
    const color = DistributionStatusColors[status] || '#9e9e9e';

    let icon = null;
    if (status === DistributionStatus.AVAILABLE) icon = <SendIcon />;
    else if (status === DistributionStatus.DOWNLOADED) icon = <DownloadIcon />;
    else if (status === DistributionStatus.EXPIRED) icon = <PendingIcon />;
    else if (status === DistributionStatus.REVOKED) icon = <CancelIcon />;
    else if (status === DistributionStatus.FAILED) icon = <ErrorIcon />;

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

  const distributions = distributionsData?.data || [];
  const totalDistributions = distributionsData?.total || 0;

  // Statistics - memoized to avoid recalculation
  const stats = useMemo(() => ({
    total: totalDistributions,
    available: distributions.filter(d => d.status === DistributionStatus.AVAILABLE).length,
    downloaded: distributions.filter(d => d.status === DistributionStatus.DOWNLOADED).length,
    expired: distributions.filter(d => d.status === DistributionStatus.EXPIRED).length,
    revoked: distributions.filter(d => d.status === DistributionStatus.REVOKED).length,
  }), [totalDistributions, distributions]);

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
        <Typography color="text.primary">Package Distribution</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Package Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign and manage package distributions to examination centres
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetchDistributions()}
            disabled={distributionsLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Create Distribution
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Total Distributions
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
                Available
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.available}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Downloaded
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {stats.downloaded}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Expired
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.expired}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Revoked
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.revoked}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search distributions by package, centre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">All Statuses</option>
            {Object.entries(DistributionStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Distribution List */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Distributions</Typography>
        </Box>

        {distributionsLoading && distributions.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading distributions...</Typography>
          </Box>
        ) : distributions.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No distributions match your search' : 'No distributions found'}
            </Typography>
          </Box>
        ) : (
          distributions.map((dist) => (
            <Box
              key={dist._id}
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
                    {dist.packageId?.packageCode || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dist.fileName || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Centre: {dist.centreCode}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  {getDistributionStatusChip(dist.status)}
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Downloads
                  </Typography>
                  <Typography variant="body2">
                    {dist.downloadCount || 0} / {dist.maxDownloadAttempts || 5}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Expires
                  </Typography>
                  <Typography variant="body2">
                    {new Date(dist.expiresAt).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Actions
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedDistributionId(dist._id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {dist.status === DistributionStatus.AVAILABLE && (
                      <>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownload(dist._id)}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Revoke">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              if (window.confirm('Revoke this distribution?')) {
                                handleRevokeDistribution(dist._id, 'Manual revocation');
                              }
                            }}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Paper>

      {/* Distribution Status Card (when selected) */}
      {selectedDistributionId && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Distribution Details
          </Typography>
          <DistributionStatusCard
            distribution={distributions.find(d => d._id === selectedDistributionId)}
            loading={distributionsLoading}
            onRefresh={refetchDistributions}
            onRevoke={() => {
              if (window.confirm('Revoke this distribution?')) {
                handleRevokeDistribution(selectedDistributionId, 'Manual revocation');
              }
            }}
            onDownload={() => handleDownload(selectedDistributionId)}
            canRevoke={true}
            canDownload={true}
          />
        </Box>
      )}

      {/* Distribution Dialog */}
      <DistributionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packages={mockPackages}
        centres={mockCentres}
        onCreate={handleCreateDistribution}
        loading={creating}
        error={null}
        result={createResult}
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
        open={creating || revoking}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {creating ? 'Creating distribution...' : 'Revoking distribution...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default DistributionManagementPage;