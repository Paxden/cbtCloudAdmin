/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * DownloadManagementPage
 * Main page for managing package downloads
 * 
 * Location: src/pages/download/DownloadManagementPage.jsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  History as HistoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Hooks
import {
  useDownloads,
  useDownloadHistory,
  useInitiateDownload,
  useStreamDownload,
  useVerifyDownload,
  useRetryDownload,
} from '../../hooks/useDownload';

// Import packages hook
import { usePackages } from '../../hooks/usePackage';

// Components
import DownloadDialog from '../../components/download/DownloadDialog';
import DownloadHistoryTable from '../../components/download/DownloadHistoryTable';

// Types
import {
  DownloadStatus,
  DownloadStatusLabels,
  DownloadStatusColors,
} from '../../types/download.types';

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DownloadManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState('');
  const [selectedCentreId, setSelectedCentreId] = useState(null);
  const [selectedCentreCode, setSelectedCentreCode] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');

  // Hooks for download operations
  const { initiateDownload, loading: initiating, result: initiateResult } = useInitiateDownload();
  const { streamDownload, loading: streaming, progress } = useStreamDownload();
  const { verifyDownload, loading: verifying } = useVerifyDownload();
  const { retryDownload, loading: retrying } = useRetryDownload();

  // ✅ Memoize filter params to prevent infinite re-renders
  const downloadParams = useMemo(() => ({
    page: page + 1,
    limit,
    search: searchQuery || undefined,
    status: statusFilter || undefined,
  }), [page, limit, searchQuery, statusFilter]);

  // Get downloads with memoized params
  const {
    data: downloadsData,
    loading: downloadsLoading,
    error: downloadsError,
    refetch: refetchDownloads,
  } = useDownloads(downloadParams);

  // Get download history for selected package
  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useDownloadHistory(selectedPackageId, {
    limit: 50,
  }, {
    enabled: !!selectedPackageId && historyDialogOpen,
  });

  // ✅ Memoize package params
  const packageParams = useMemo(() => ({
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
    status: 'VALIDATED', // Only get validated packages that can be downloaded
  }), [searchQuery]);

  // Get packages with memoized params
  const {
    data: packagesData,
    loading: packagesLoading,
    error: packagesError,
    refetch: refetchPackages,
  } = usePackages(packageParams);

  // ✅ Use real data from API - NO MOCK DATA
  const packages = packagesData?.data || [];
  const downloads = downloadsData?.data || [];
  const totalDownloads = downloadsData?.meta?.total || downloadsData?.total || downloads.length;

  // ============================================================
  // ✅ HELPER FUNCTIONS
  // ============================================================

  const getDownloadStatusChip = useCallback((status) => {
    const label = DownloadStatusLabels[status] || status;
    const color = DownloadStatusColors[status] || '#9e9e9e';

    let icon = null;
    if (status === DownloadStatus.COMPLETED) icon = <CheckCircleIcon />;
    else if (status === DownloadStatus.FAILED) icon = <ErrorIcon />;
    else if (status === DownloadStatus.IN_PROGRESS) icon = <PendingIcon />;
    else if (status === DownloadStatus.STARTED) icon = <DownloadIcon />;

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

  // ✅ Check if package can be downloaded
  const canDownloadPackage = useCallback((pkg) => {
    if (!pkg) return false;
    // Package should be validated or have a file ready
    return pkg.status === 'VALIDATED' || 
           pkg.status === 'DOWNLOADED' || 
           pkg.status === 'AVAILABLE' ||
           pkg.status === 'GENERATED';
  }, []);

  // ============================================================
  // ✅ SNACKBAR FUNCTIONS
  // ============================================================

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  }, []);

  // ============================================================
  // ✅ HANDLERS
  // ============================================================

  const handleOpenDialog = useCallback((packageId, packageCode, centreId, centreCode) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setSelectedCentreId(centreId);
    setSelectedCentreCode(centreCode);
    setDialogOpen(true);
  }, [showSnackbar]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    if (selectedPackageId) {
      refetchHistory();
    }
    refetchDownloads();
  }, [selectedPackageId, refetchHistory, refetchDownloads]);

  const handleOpenHistoryDialog = useCallback((packageId, packageCode) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setHistoryDialogOpen(true);
    setTimeout(() => refetchHistory(), 100);
  }, [refetchHistory, showSnackbar]);

  const handleCloseHistoryDialog = useCallback(() => {
    setHistoryDialogOpen(false);
    setSelectedPackageId(null);
  }, []);

  const handleInitiateDownload = useCallback(async (packageId, centreId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      const result = await initiateDownload(packageId, centreId);
      showSnackbar('Download initiated successfully!', 'success');
      
      if (result.downloadToken && result.downloadId) {
        await handleStreamDownload(packageId, result.downloadToken, result.fileName);
      }
      refetchDownloads();
      refetchHistory();
    } catch (error) {
      showSnackbar(error.message || 'Failed to initiate download', 'error');
    }
  }, [initiateDownload, refetchDownloads, refetchHistory, showSnackbar]);

  const handleStreamDownload = useCallback(async (packageId, token, fileName) => {
    try {
      await streamDownload(packageId, token, fileName);
      showSnackbar('Download completed successfully!', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to download file', 'error');
    }
  }, [streamDownload, showSnackbar]);

  const handleVerifyDownload = useCallback(async (downloadId) => {
    if (!downloadId || downloadId === 'null') {
      showSnackbar('Invalid download selected', 'error');
      return;
    }
    try {
      const result = await verifyDownload(downloadId);
      showSnackbar(
        result.verified ? 'Download verified successfully!' : 'Download verification failed',
        result.verified ? 'success' : 'error'
      );
      refetchDownloads();
    } catch (error) {
      showSnackbar(error.message || 'Failed to verify download', 'error');
    }
  }, [verifyDownload, refetchDownloads, showSnackbar]);

  const handleRetryDownload = useCallback(async (downloadId) => {
    if (!downloadId || downloadId === 'null') {
      showSnackbar('Invalid download selected', 'error');
      return;
    }
    try {
      await retryDownload(downloadId);
      showSnackbar('Download retry initiated', 'success');
      refetchDownloads();
    } catch (error) {
      showSnackbar(error.message || 'Failed to retry download', 'error');
    }
  }, [retryDownload, refetchDownloads, showSnackbar]);

  const handleViewPackage = useCallback((packageId) => {
    if (packageId && packageId !== 'null') {
      navigate(`/packages/${packageId}`);
    }
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    refetchDownloads();
    if (selectedPackageId && historyDialogOpen) {
      refetchHistory();
    }
    refetchPackages();
    showSnackbar('Refreshed successfully', 'success');
  }, [refetchDownloads, refetchHistory, refetchPackages, selectedPackageId, historyDialogOpen, showSnackbar]);

  // ============================================================
  // ✅ STATISTICS - Calculate from real data
  // ============================================================

  const stats = useMemo(() => {
    const total = downloads.length;
    const completed = downloads.filter(d => 
      d.downloadStatus === DownloadStatus.COMPLETED || 
      d.status === 'COMPLETED' ||
      d.status === 'DOWNLOADED'
    ).length;
    const failed = downloads.filter(d => 
      d.downloadStatus === DownloadStatus.FAILED || 
      d.status === 'FAILED'
    ).length;
    const inProgress = downloads.filter(d => 
      d.downloadStatus === DownloadStatus.IN_PROGRESS || 
      d.downloadStatus === DownloadStatus.STARTED ||
      d.status === 'IN_PROGRESS' ||
      d.status === 'STARTED'
    ).length;
    
    return { total, completed, failed, inProgress };
  }, [downloads]);

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
        <Typography color="text.primary">Package Downloads</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Package Downloads
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Securely download CBTX packages for examination centres
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={downloadsLoading || packagesLoading}
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
                Total Downloads
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
                Completed
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                In Progress
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.inProgress}
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

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search downloads by package, centre..."
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
            {Object.entries(DownloadStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Available Packages Section - Uses REAL data only */}
      <Paper sx={{ overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Available Packages for Download</Typography>
        </Box>

        {packagesLoading && packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading packages...</Typography>
          </Box>
        ) : packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No packages match your search' : 'No packages available for download'}
            </Typography>
          </Box>
        ) : (
          // ✅ Filter packages for download availability
          packages.filter(canDownloadPackage).map((pkg) => (
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
                    {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : 
                     pkg.generationTiming?.completedAt ? new Date(pkg.generationTiming.completedAt).toLocaleDateString() : 
                     'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Size
                  </Typography>
                  <Typography variant="body2">
                    {pkg.packageSize ? formatFileSize(pkg.packageSize) : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={pkg.status || 'Available'}
                    size="small"
                    color={pkg.status === 'VALIDATED' ? 'success' : 'primary'}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Actions
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Download Package">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(
                          pkg._id,
                          pkg.packageCode,
                          pkg.centreId,
                          pkg.centreCode
                        )}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Download History">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenHistoryDialog(pkg._id, pkg.packageCode)}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Package">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPackage(pkg._id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Paper>

      {/* Download History Section */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Recent Downloads</Typography>
        </Box>

        {downloadsLoading && downloads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading downloads...</Typography>
          </Box>
        ) : downloads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No download records found
            </Typography>
          </Box>
        ) : (
          downloads.map((download) => (
            <Box
              key={download._id}
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
                    {download.packageId?.packageCode || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {download.fileName || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Centre: {download.centreCode}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  {getDownloadStatusChip(download.downloadStatus || download.status)}
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Size
                  </Typography>
                  <Typography variant="body2">
                    {download.fileSize ? formatFileSize(download.fileSize) : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Downloaded At
                  </Typography>
                  <Typography variant="body2">
                    {download.createdAt ? new Date(download.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Actions
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Verify Download">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleVerifyDownload(download._id)}
                        disabled={verifying}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {download.downloadStatus === DownloadStatus.FAILED && (
                      <Tooltip title="Retry Download">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleRetryDownload(download._id)}
                          disabled={retrying}
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="View Timeline">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenHistoryDialog(
                          download.packageId?._id || download.packageId,
                          download.packageId?.packageCode || 'N/A'
                        )}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Paper>

      {/* Download Progress */}
      {streaming && (
        <Box sx={{ mt: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" gutterBottom>
              Downloading: {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Paper>
        </Box>
      )}

      {/* Download Dialog */}
      <DownloadDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packageId={selectedPackageId}
        packageCode={selectedPackageCode}
        centreId={selectedCentreId}
        centreCode={selectedCentreCode}
        onInitiate={handleInitiateDownload}
        loading={initiating || streaming}
        error={null}
        result={initiateResult}
      />

      {/* Download History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={handleCloseHistoryDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Download History: {selectedPackageCode}
            </Typography>
            <IconButton onClick={handleCloseHistoryDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DownloadHistoryTable
            history={historyData || []}
            loading={historyLoading}
            onViewDownload={(downloadId) => {
              showSnackbar(`Viewing download ${downloadId}`, 'info');
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog}>Close</Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={() => refetchHistory()}
            disabled={historyLoading}
          >
            Refresh
          </Button>
        </DialogActions>
      </Dialog>

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
        open={initiating || streaming || verifying || retrying}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {initiating ? 'Initiating download...' : 
             streaming ? `Downloading... ${progress}%` :
             verifying ? 'Verifying download...' :
             retrying ? 'Retrying download...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default DownloadManagementPage;