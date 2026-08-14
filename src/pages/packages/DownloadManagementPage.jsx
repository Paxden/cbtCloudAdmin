
/**
 * DownloadManagementPage
 * Location: src/pages/download/DownloadManagementPage.jsx
 */

import  { useState, useMemo, useCallback } from 'react';
import {
  Box, Container, Breadcrumbs, Link, Typography, Paper, Button, Alert,
  Snackbar, CircularProgress, Backdrop, TextField, InputAdornment, Chip,
  Card, CardContent, Grid, Stack, IconButton, Tooltip, TablePagination,
  LinearProgress,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon, Search as SearchIcon, Refresh as RefreshIcon,
  Download as DownloadIcon, Visibility as VisibilityIcon, CheckCircle as CheckCircleIcon,
  Error as ErrorIcon, History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import {
  useDownloads,
  useDownloadHistory,
  useDownloadStatistics,
  useInitiateDownload,
  useStreamDownload,
  useCompleteDownload,
  useFailDownload,
  useVerifyDownload,
  useRetryDownload,
} from '../../hooks/useDownload';
import { usePackages } from '../../hooks/usePackage';

import DownloadDialog from '../../components/download/DownloadDialog';
import DownloadHistoryTable from '../../components/download/DownloadHistoryTable';

import { DownloadStatus, DownloadStatusLabels, DownloadStatusColors } from '../../types/download.types';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

const DownloadManagementPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState('');
  const [selectedCentreId, setSelectedCentreId] = useState(null);
  const [selectedCentreCode, setSelectedCentreCode] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);
  const handleCloseSnackbar = useCallback(() => setSnackbar((s) => ({ ...s, open: false })), []);

  // Mutations
  const { initiateDownload, loading: initiating } = useInitiateDownload();
  const { streamDownload, loading: streaming, progress } = useStreamDownload();
  const { completeDownload } = useCompleteDownload();
  const { failDownload } = useFailDownload();
  const { verifyDownload, loading: verifying } = useVerifyDownload();
  const { retryDownload, loading: retrying } = useRetryDownload();

  // Reads
  const downloadParams = useMemo(
    () => ({ page: page + 1, limit, search: searchQuery || undefined, status: statusFilter || undefined }),
    [page, limit, searchQuery, statusFilter],
  );
  const { data: downloadsData, loading: downloadsLoading, refetch: refetchDownloads } = useDownloads(downloadParams);
  const downloads = downloadsData?.data || [];
  const totalDownloads = downloadsData?.meta?.total || 0;

  const { data: stats, loading: statsLoading, refetch: refetchStats } = useDownloadStatistics({});

  const packageParams = useMemo(() => ({ page: 1, limit: 100, search: searchQuery || undefined }), [searchQuery]);
  const { data: packagesData, loading: packagesLoading, refetch: refetchPackages } = usePackages(packageParams);
  const packages = packagesData?.data || [];

  const { data: historyData, loading: historyLoading, refetch: refetchHistory } = useDownloadHistory(
    selectedPackageId,
    50,
    { enabled: !!selectedPackageId && historyDialogOpen },
  );

  const refreshAll = useCallback(() => {
    refetchDownloads();
    refetchStats();
    refetchPackages();
  }, [refetchDownloads, refetchStats, refetchPackages]);

  // ── Handlers ──────────────────────────────────────────────
  const canDownloadPackage = useCallback(
    (pkg) => ['VALIDATED', 'DOWNLOADED', 'AVAILABLE'].includes(pkg.status),
    [],
  );

  const getDownloadStatusChip = useCallback((status) => {
    const label = DownloadStatusLabels[status] || status;
    const color = DownloadStatusColors[status] || '#9e9e9e';
    let icon = null;
    if (status === DownloadStatus.COMPLETED) icon = <CheckCircleIcon />;
    else if (status === DownloadStatus.FAILED) icon = <ErrorIcon />;
    return (
      <Chip icon={icon} label={label} size="small"
        sx={{ bgcolor: color, color: 'white', '& .MuiChip-icon': { color: 'white' } }} />
    );
  }, []);

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
    refreshAll();
  }, [refreshAll]);

  const handleOpenHistoryDialog = useCallback((packageId, packageCode) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setHistoryDialogOpen(true);
  }, [showSnackbar]);

  const handleCloseHistoryDialog = useCallback(() => {
    setHistoryDialogOpen(false);
    setSelectedPackageId(null);
  }, []);

  const handleInitiateDownload = useCallback(async (packageId, centreId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    let downloadId;
    try {
      const initResult = await initiateDownload(packageId, centreId);
      downloadId = initResult.downloadId;
      showSnackbar('Download started — fetching file...', 'info');

      await streamDownload(packageId, initResult.downloadToken, initResult.fileName);

      await completeDownload(downloadId);
      showSnackbar('Download completed successfully!', 'success');
    } catch (error) {
      if (downloadId) {
        // best-effort — don't let a logging failure mask the real error
        failDownload(downloadId, error.message).catch(() => {});
      }
      showSnackbar(error.message || 'Failed to download package', 'error');
    } finally {
      refreshAll();
    }
  }, [initiateDownload, streamDownload, completeDownload, failDownload, showSnackbar, refreshAll]);

  const handleVerifyDownload = useCallback(async (downloadId) => {
    try {
      const result = await verifyDownload(downloadId);
      showSnackbar(
        result.verified ? 'File verified — matches expected size' : 'Verification failed — file missing or size mismatch',
        result.verified ? 'success' : 'error',
      );
      refetchDownloads();
    } catch (error) {
      showSnackbar(error.message || 'Failed to verify download', 'error');
    }
  }, [verifyDownload, refetchDownloads, showSnackbar]);

  const handleRetryDownload = useCallback(async (downloadId) => {
    try {
      await retryDownload(downloadId);
      showSnackbar('Download reset — ready to retry', 'success');
      refetchDownloads();
    } catch (error) {
      showSnackbar(error.message || 'Failed to retry download', 'error');
    }
  }, [retryDownload, refetchDownloads, showSnackbar]);

  const handleViewPackage = useCallback((packageId) => {
    if (packageId && packageId !== 'null') navigate(`/packages/${packageId}`);
  }, [navigate]);

  // ── Render ────────────────────────────────────────────────
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link color="inherit" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          Dashboard
        </Link>
        <Typography color="text.primary">Package Downloads</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Package Downloads</Typography>
          <Typography variant="body2" color="text.secondary">
            Securely download CBTX packages for examination centres
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={refreshAll} disabled={downloadsLoading}>
          Refresh
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: stats?.total ?? 0, color: 'inherit' },
          { label: 'Completed', value: stats?.byStatus?.completed ?? 0, color: 'success.main' },
          { label: 'In Progress', value: stats?.byStatus?.inProgress ?? 0, color: 'warning.main' },
          { label: 'Failed', value: stats?.byStatus?.failed ?? 0, color: 'error.main' },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">{s.label}</Typography>
                {statsLoading ? (
                  <CircularProgress size={24} sx={{ mt: 1 }} />
                ) : (
                  <Typography variant="h4" fontWeight="bold" color={s.color}>{s.value}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {stats?.successRate !== undefined && !statsLoading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Success rate: {stats.successRate}% · Unique centres: {stats.uniqueCentres ?? 0}
        </Typography>
      )}

      {/* Search / Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by package code..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <TextField
            select label="Status" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            size="small" sx={{ minWidth: 150 }} SelectProps={{ native: true }}
          >
            <option value="">All Statuses</option>
            {Object.entries(DownloadStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Available Packages */}
      <Paper sx={{ overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Available Packages for Download</Typography>
        </Box>
        {packagesLoading && packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
        ) : packages.filter(canDownloadPackage).length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No packages available for download</Typography>
          </Box>
        ) : (
          packages.filter(canDownloadPackage).map((pkg) => (
            <Box key={pkg._id} sx={{ p: 2, borderBottom: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" fontWeight="medium">{pkg.packageCode}</Typography>
                  <Typography variant="body2" color="text.secondary">{pkg.examInfo?.examName || 'N/A'}</Typography>
                  <Typography variant="caption" color="text.secondary">Centre: {pkg.centreCode}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">Size</Typography>
                  <Typography variant="body2">{pkg.packageSize ? formatFileSize(pkg.packageSize) : 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Download Package">
                      <IconButton size="small" color="primary"
                        onClick={() => handleOpenDialog(pkg._id, pkg.packageCode, pkg.centreId, pkg.centreCode)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Download History">
                      <IconButton size="small" onClick={() => handleOpenHistoryDialog(pkg._id, pkg.packageCode)}>
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Package">
                      <IconButton size="small" onClick={() => handleViewPackage(pkg._id)}>
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

      {/* Recent Downloads — server-paginated */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Recent Downloads</Typography>
        </Box>
        {downloadsLoading && downloads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
        ) : downloads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No download records found</Typography>
          </Box>
        ) : (
          downloads.map((download) => (
            <Box key={download._id} sx={{ p: 2, borderBottom: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {download.packageId?.packageCode || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    By {download.downloadedBy?.name || 'Unknown'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>{getDownloadStatusChip(download.downloadStatus)}</Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2">{download.fileSize ? formatFileSize(download.fileSize) : 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2">
                    {download.timeline?.startedAt ? new Date(download.timeline.startedAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Verify Integrity">
                      <IconButton size="small" color="success" disabled={verifying}
                        onClick={() => handleVerifyDownload(download._id)}>
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {download.downloadStatus === DownloadStatus.FAILED && (
                      <Tooltip title="Retry Download">
                        <IconButton size="small" color="warning" disabled={retrying}
                          onClick={() => handleRetryDownload(download._id)}>
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View Timeline">
                      <IconButton size="small"
                        onClick={() => handleOpenHistoryDialog(
                          download.packageId?._id || download.packageId,
                          download.packageId?.packageCode || 'N/A',
                        )}>
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
        <TablePagination
          component="div"
          count={totalDownloads}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {streaming && (
        <Box sx={{ mt: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" gutterBottom>Downloading: {progress}%</Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Paper>
        </Box>
      )}

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
        result={null}
      />

      {historyDialogOpen && (
        <DownloadHistoryTable
          open={historyDialogOpen}
          onClose={handleCloseHistoryDialog}
          packageCode={selectedPackageCode}
          history={historyData || []}
          loading={historyLoading}
          onRefresh={refetchHistory}
        />
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Backdrop open={initiating || streaming} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {streaming ? `Downloading... ${progress}%` : 'Initiating download...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default DownloadManagementPage;