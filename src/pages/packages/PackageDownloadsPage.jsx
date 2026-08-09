/**
 * PackageDownloadsPage
 * Main page for package downloads
 * 
 * Location: src/pages/package/PackageDownloadsPage.jsx
 */

import  { useState } from 'react';
import {
  Box,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePackageDownloads } from '../../hooks/usePackageDownloads';
import { useAuth } from '../../hooks/useAuth';

// Components
import DownloadSummaryCards from '../../components/packageDownloads/DownloadSummaryCards';
import DownloadToolbar from '../../components/packageDownloads/DownloadToolbar';
import DownloadFilters from '../../components/packageDownloads/DownloadFilters';
import DownloadTable from '../../components/packageDownloads/DownloadTable';
import DownloadDetailsDrawer from '../../components/packageDownloads/DownloadDetailsDrawer';
import DownloadTimeline from '../../components/packageDownloads/DownloadTimeline';
import DownloadStatistics from '../../components/packageDownloads/DownloadStatistics';

// Constants
const PAGE_TITLE = 'Package Downloads';

// Helper function for user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const PackageDownloadsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions
  const canRetry = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canVerify = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canView = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN' || userRole === 'EXAM_MANAGER';

  // Use the hook
  const {
    downloads,
    totalDownloads,
    selectedDownload,
    statistics,
    timeline,
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    loadingTimeline,
    exporting,
    detailsDrawerOpen,
    timelineDialogOpen,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openTimeline,
    closeTimeline,
    exportReport,
    retryDownload,
    verifyDownload,
    refresh
  } = usePackageDownloads();

  // Local state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Count active filters
  const filterCount = Object.keys(filters).filter(
    key => !['page', 'limit', 'sort'].includes(key) && filters[key] && filters[key] !== ''
  ).length;

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle verify download
  const handleVerify = async (downloadId) => {
    try {
      setActionLoading(true);
      const result = await verifyDownload(downloadId);
      setVerifyResult(result);
      setVerifyDialogOpen(true);
      showSnackbar('Download verification completed', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to verify download', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle retry download
  const handleRetry = async (downloadId) => {
    try {
      setActionLoading(true);
      await retryDownload(downloadId);
      showSnackbar('Download retry initiated', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to retry download', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle view package
  const handleViewPackage = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  // If user doesn't have permission
  if (!canView) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">
          You do not have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link
          color="inherit"
          onClick={() => navigate('/dashboard')}
          sx={{ cursor: 'pointer' }}
        >
          Dashboard
        </Link>
        <Link
          color="inherit"
          onClick={() => navigate('/packages')}
          sx={{ cursor: 'pointer' }}
        >
          Packages
        </Link>
        <Typography color="text.primary">{PAGE_TITLE}</Typography>
      </Breadcrumbs>

      {/* Summary Cards */}
      <DownloadSummaryCards
        statistics={statistics}
        loading={loadingStatistics}
      />

      {/* Toolbar */}
      <DownloadToolbar
        onRefresh={refresh}
        onExport={exportReport}
        totalCount={totalDownloads}
        loading={isLoading}
        filterCount={filterCount}
        exporting={exporting}
      />

      {/* Filters */}
      <DownloadFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Table */}
      <DownloadTable
        downloads={downloads}
        total={totalDownloads}
        page={filters.page}
        limit={filters.limit}
        loading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewDetails={openDetails}
        onViewTimeline={openTimeline}
        onVerify={handleVerify}
        onRetry={handleRetry}
        onViewPackage={handleViewPackage}
        canRetry={canRetry}
        canVerify={canVerify}
      />

      {/* Statistics */}
      <Box sx={{ mt: 3 }}>
        <DownloadStatistics data={statistics} loading={loadingStatistics} />
      </Box>

      {/* Details Drawer */}
      <DownloadDetailsDrawer
        open={detailsDrawerOpen}
        onClose={closeDetails}
        download={selectedDownload}
        loading={loadingDetails}
        onVerify={handleVerify}
        onRetry={handleRetry}
        canVerify={canVerify}
        canRetry={canRetry}
      />

      {/* Timeline Dialog */}
      <Dialog
        open={timelineDialogOpen}
        onClose={closeTimeline}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Download Timeline</Typography>
            <IconButton onClick={closeTimeline} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DownloadTimeline timeline={timeline} loading={loadingTimeline} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTimeline}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Verify Result Dialog */}
      <Dialog
        open={verifyDialogOpen}
        onClose={() => setVerifyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Verification Result</DialogTitle>
        <DialogContent>
          {verifyResult && (
            <Box>
              <Alert
                severity={verifyResult.verified ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                {verifyResult.verified
                  ? 'Download verified successfully'
                  : 'Verification failed'}
              </Alert>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Checksum
                  </Typography>
                  <Typography variant="body2">
                    {verifyResult.checksumMatch ? '✅ Matches' : '❌ Mismatch'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Signature
                  </Typography>
                  <Typography variant="body2">
                    {verifyResult.signatureValid ? '✅ Valid' : '❌ Invalid'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Details
                  </Typography>
                  <Typography variant="body2">
                    {verifyResult.details || 'No additional details'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Backdrop */}
      <Backdrop
        open={actionLoading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            Processing...
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageDownloadsPage;