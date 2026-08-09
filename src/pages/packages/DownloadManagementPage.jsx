/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
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
   Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
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
  useDownloadHistory,
  useInitiateDownload,
  useStreamDownload,
} from '../../hooks/useDownload';

// Components
import DownloadDialog from '../../components/download/DownloadDialog';
import DownloadHistoryTable from '../../components/download/DownloadHistoryTable';

// Types
import {
  DownloadStatus,
  DownloadStatusLabels,
  DownloadStatusColors,
} from '../../types/download.types';

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

  // Hooks for download operations
  const { initiateDownload, loading: initiating, result: initiateResult } = useInitiateDownload();
  const { streamDownload, loading: streaming, progress, downloadUrl } = useStreamDownload();

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

  // Mock packages data - replace with actual API call
  const packages = useMemo(() => [
    {
      id: '1',
      packageCode: 'PROMO-2027-ABJ001-V1',
      examName: 'Promotion Examination 2027',
      centreCode: 'ABJ001',
      centreId: 'centre-1',
      status: 'AVAILABLE',
      fileSize: 2048576,
      createdAt: '2026-08-01T21:14:01.468Z',
    },
    {
      id: '2',
      packageCode: 'PROMO-2027-LAG002-V1',
      examName: 'Promotion Examination 2027',
      centreCode: 'LAG002',
      centreId: 'centre-2',
      status: 'AVAILABLE',
      fileSize: 1572864,
      createdAt: '2026-08-02T10:30:00.000Z',
    },
  ], []);

  // Statistics
  const stats = useMemo(() => ({
    total: packages.length,
    available: packages.filter(p => p.status === 'AVAILABLE').length,
    downloaded: packages.filter(p => p.status === 'DOWNLOADED').length,
    expired: packages.filter(p => p.status === 'EXPIRED').length,
  }), [packages]);

  // Handlers
  const handleOpenDialog = useCallback((packageId, packageCode, centreId, centreCode) => {
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setSelectedCentreId(centreId);
    setSelectedCentreCode(centreCode);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    if (selectedPackageId) {
      refetchHistory();
    }
  }, [selectedPackageId, refetchHistory]);

  const handleOpenHistoryDialog = useCallback((packageId, packageCode) => {
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setHistoryDialogOpen(true);
    // Fetch history when dialog opens
    setTimeout(() => refetchHistory(), 100);
  }, [refetchHistory]);

  const handleCloseHistoryDialog = useCallback(() => {
    setHistoryDialogOpen(false);
    setSelectedPackageId(null);
  }, []);

  const handleInitiateDownload = useCallback(async (packageId, centreId) => {
    try {
      const result = await initiateDownload(packageId, centreId);
      showSnackbar('Download initiated successfully!', 'success');
      
      // If we have a token and download ID, start streaming
      if (result.downloadToken && result.downloadId) {
        await handleStreamDownload(packageId, result.downloadToken, result.fileName);
      }
      refetchHistory();
    } catch (error) {
      showSnackbar(error.message || 'Failed to initiate download', 'error');
    }
  }, [initiateDownload, refetchHistory]);

  const handleStreamDownload = useCallback(async (packageId, token, fileName) => {
    try {
      await streamDownload(packageId, token, fileName);
      showSnackbar('Download completed successfully!', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to download file', 'error');
    }
  }, [streamDownload]);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  }, []);

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

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Filter packages
  const filteredPackages = useMemo(() => {
    return packages.filter(
      (pkg) =>
        pkg.packageCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.centreCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [packages, searchQuery]);

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
          onClick={() => {
            if (selectedPackageId && historyDialogOpen) {
              refetchHistory();
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
                Available
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.available}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} sm={6} md={3}>
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
          <Typography variant="h6">Available Packages</Typography>
        </Box>

        {filteredPackages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No packages match your search' : 'No packages available for download'}
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
                    Size
                  </Typography>
                  <Typography variant="body2">
                    {formatFileSize(pkg.fileSize)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={pkg.status}
                    size="small"
                    color={pkg.status === 'AVAILABLE' ? 'success' : 'default'}
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
                          pkg.id,
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
                        onClick={() => handleOpenHistoryDialog(pkg.id, pkg.packageCode)}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Package">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/packages/${pkg.id}`)}
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

      {/* Download Progress (if streaming) */}
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
              // Navigate to download details or show in dialog
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
        open={initiating || streaming}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {initiating ? 'Initiating download...' : 'Downloading package...'}
          </Typography>
          {streaming && (
            <Typography sx={{ mt: 1 }}>
              {progress}% complete
            </Typography>
          )}
        </Box>
      </Backdrop>
    </Container>
  );
};

export default DownloadManagementPage;