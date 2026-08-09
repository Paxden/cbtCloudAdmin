/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/**
 * PackageManagementPage
 * Main page for managing centre packages
 * 
 * Location: src/pages/package/PackageManagementPage.jsx
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
  Inventory as PackageIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Hooks
import {
  usePackages,
  useGeneratePackage,
  useGenerateAllPackages,
  useUpdatePackageStatus,
} from '../../hooks/usePackage';

// Import instances hook
import { useInstances } from '../../hooks/useInstances';

// Import centres service
import { getCentres } from '../../services/centres/centreService';

// Components
import PackageGenerationDialog from '../../components/package/PackageGenerationDialog';
import PackageStatusCard from '../../components/package/PackageStatusCard';

// Types
import {
  PackageStatus,
  PackageStatusLabels,
  PackageStatusColors,
} from '../../types/package.types';

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const PackageManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState('');
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

  // Hooks for package operations
  const { generatePackage, loading: generating, result: generateResult } = useGeneratePackage();
  const { generateAllPackages, loading: generatingAll, result: generateAllResult } = useGenerateAllPackages();
  const { updatePackageStatus, loading: updatingStatus } = useUpdatePackageStatus();

  // ✅ Memoize filter params to prevent infinite re-renders
  const packageParams = useMemo(() => ({
    page: page + 1,
    limit,
    search: searchQuery || undefined,
    status: statusFilter || undefined,
  }), [page, limit, searchQuery, statusFilter]);

  // Get packages with memoized params
  const {
    data: packagesData,
    loading: packagesLoading,
    error: packagesError,
    refetch: refetchPackages,
  } = usePackages(packageParams);

  // ✅ Fetch instances for the dialog - only LOCKED instances
  const {
    data: instancesData,
    loading: instancesLoading,
    error: instancesError,
  } = useInstances({
    status: 'LOCKED',
    limit: 100,
  });

  // ✅ Fetch centres for the dialog
  const [centres, setCentres] = useState([]);
  const [centresLoading, setCentresLoading] = useState(false);

  const fetchCentres = useCallback(async () => {
    setCentresLoading(true);
    try {
      const response = await getCentres({ 
        status: 'ACTIVE',
        limit: 100 
      });
      // Handle response - extract centres array
      let centresData = [];
      if (response?.data) {
        if (Array.isArray(response.data)) {
          centresData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          centresData = response.data.data;
        } else if (response.data.centres && Array.isArray(response.data.centres)) {
          centresData = response.data.centres;
        }
      }
      setCentres(centresData);
    } catch (error) {
      console.error('Failed to fetch centres:', error);
    } finally {
      setCentresLoading(false);
    }
  }, []);

  // Fetch centres when dialog opens
  React.useEffect(() => {
    if (dialogOpen && centres.length === 0) {
      fetchCentres();
    }
  }, [dialogOpen, centres.length, fetchCentres]);

  // Handlers
  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    refetchPackages();
  }, [refetchPackages]);

  const handleGenerate = useCallback(async (data) => {
    try {
      await generatePackage(data);
      showSnackbar('Package generated successfully!', 'success');
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to generate package', 'error');
    }
  }, [generatePackage, refetchPackages]);

  const handleGenerateAll = useCallback(async (data) => {
    try {
      await generateAllPackages(data);
      showSnackbar('All packages generated successfully!', 'success');
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to generate all packages', 'error');
    }
  }, [generateAllPackages, refetchPackages]);

  const handleUpdateStatus = useCallback(async (packageId, status, reason = '') => {
    try {
      await updatePackageStatus(packageId, status, reason);
      showSnackbar(`Package status updated to ${PackageStatusLabels[status]}`, 'success');
      refetchPackages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to update package status', 'error');
    }
  }, [updatePackageStatus, refetchPackages]);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  }, []);

  const handleViewPackage = useCallback((packageId) => {
    navigate(`/packages/${packageId}`);
  }, [navigate]);

  const getPackageStatusChip = useCallback((status) => {
    const label = PackageStatusLabels[status] || status;
    const color = PackageStatusColors[status] || '#9e9e9e';

    let icon = null;
    if (status === PackageStatus.GENERATED || status === PackageStatus.VALIDATED) {
      icon = <CheckCircleIcon />;
    } else if (status === PackageStatus.GENERATING) {
      icon = <PendingIcon />;
    } else if (status === PackageStatus.REVOKED || status === PackageStatus.ARCHIVED) {
      icon = <ErrorIcon />;
    }

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

  const packages = packagesData?.data || [];
  const totalPackages = packagesData?.total || 0;
  const instances = instancesData?.data || [];

  // Statistics - memoized to avoid recalculation
  const stats = useMemo(() => ({
    total: totalPackages,
    generated: packages.filter(p => p.status === PackageStatus.GENERATED).length,
    encrypted: packages.filter(p => p.status === PackageStatus.ENCRYPTED).length,
    signed: packages.filter(p => p.status === PackageStatus.SIGNED).length,
    validated: packages.filter(p => p.status === PackageStatus.VALIDATED).length,
    revoked: packages.filter(p => p.status === PackageStatus.REVOKED).length,
  }), [totalPackages, packages]);

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
        <Typography color="text.primary">Package Management</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Package Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and manage centre-specific examination packages
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetchPackages()}
            disabled={packagesLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Generate Package
          </Button>
        </Box>
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
                Encrypted
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats.encrypted}
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
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.signed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Validated
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.validated}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search packages by code, centre, exam..."
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
            {Object.entries(PackageStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </TextField>
        </Box>
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
          packages.map((pkg) => (
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
                    Version
                  </Typography>
                  <Typography variant="body2">v{pkg.packageVersion || 1}</Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Candidates
                  </Typography>
                  <Typography variant="body2">{pkg.candidateCount || 0}</Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  {getPackageStatusChip(pkg.status)}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Actions
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPackage(pkg._id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Update Status">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          handleUpdateStatus(pkg._id, PackageStatus.GENERATED);
                        }}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Archive">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (window.confirm('Archive this package?')) {
                            handleUpdateStatus(pkg._id, PackageStatus.ARCHIVED, 'Archived manually');
                          }
                        }}
                      >
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Paper>

      {/* Package Generation Dialog */}
      <PackageGenerationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        instances={instances}
        centres={centres}
        onGenerate={handleGenerate}
        onGenerateAll={handleGenerateAll}
        loading={generating || generatingAll}
        error={null}
        result={generateResult || generateAllResult}
        mode={generateResult ? 'single' : 'all'}
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
        open={generating || generatingAll || updatingStatus}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {generating ? 'Generating package...' : 
             generatingAll ? 'Generating all packages...' : 
             updatingStatus ? 'Updating status...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageManagementPage;