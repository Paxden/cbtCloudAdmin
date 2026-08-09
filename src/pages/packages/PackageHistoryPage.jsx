/* eslint-disable no-unused-vars */
/**
 * PackageHistoryPage
 * Main page for package history & audit trail
 * 
 * Location: src/pages/package/PackageHistoryPage.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Close as CloseIcon } from '@mui/icons-material';
import { usePackageHistory } from '../../hooks/usePackageHistory';
import { useAuth } from '../../hooks/useAuth';

// Components
import HistorySummaryCards from '../../components/packageHistory/HistorySummaryCards';
import HistoryToolbar from '../../components/packageHistory/HistoryToolbar';
import HistoryFilters from '../../components/packageHistory/HistoryFilters';
import HistoryTable from '../../components/packageHistory/HistoryTable';
import HistoryDetailsDrawer from '../../components/packageHistory/HistoryDetailsDrawer';
import HistoryTimeline from '../../components/packageHistory/HistoryTimeline';
import PackageLifecycleCard from '../../components/packageHistory/PackageLifecycleCard';

const PAGE_TITLE = 'Package History & Audit Trail';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const PackageHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);
  const canView = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN' || userRole === 'EXAM_MANAGER';

  const {
    history,
    totalHistory,
    selectedHistory,
    statistics,
    timeline,
    lifecycle,
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    loadingTimeline,
    loadingLifecycle,
    exporting,
    printing,
    detailsDrawerOpen,
    timelineDialogOpen,
    lifecycleDialogOpen,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openTimeline,
    closeTimeline,
    openLifecycle,
    closeLifecycle,
    exportReport,
    printReport,
    refresh
  } = usePackageHistory();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const filterCount = Object.keys(filters).filter(
    key => !['page', 'limit', 'sort'].includes(key) && filters[key] && filters[key] !== ''
  ).length;

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleExport = async (format) => {
    try {
      setActionLoading(true);
      await exportReport(format);
      showSnackbar('Audit report exported successfully', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to export report', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setActionLoading(true);
      await printReport();
    } catch (err) {
      showSnackbar(err.message || 'Failed to print report', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewPackage = (packageId) => {
    if (packageId) {
      navigate(`/packages/${packageId}`);
    }
  };

  const handleViewVersion = (versionId) => {
    if (versionId) {
      navigate(`/packages/versions/${versionId}`);
    }
  };

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
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
          Dashboard
        </Link>
        <Link color="inherit" onClick={() => navigate('/packages')} sx={{ cursor: 'pointer' }}>
          Packages
        </Link>
        <Typography color="text.primary">{PAGE_TITLE}</Typography>
      </Breadcrumbs>

      <HistorySummaryCards statistics={statistics} loading={loadingStatistics} />

      <HistoryToolbar
        onRefresh={refresh}
        onExport={handleExport}
        onPrint={handlePrint}
        totalCount={totalHistory}
        loading={isLoading}
        filterCount={filterCount}
        exporting={exporting || actionLoading}
        printing={printing || actionLoading}
      />

      <HistoryFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      <HistoryTable
        history={history}
        total={totalHistory}
        page={filters.page}
        limit={filters.limit}
        loading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewDetails={openDetails}
        onViewTimeline={openTimeline}
        onViewPackage={handleViewPackage}
        onViewVersion={handleViewVersion}
      />

      <HistoryDetailsDrawer
        open={detailsDrawerOpen}
        onClose={closeDetails}
        history={selectedHistory}
        loading={loadingDetails}
        onViewTimeline={openTimeline}
        onViewPackage={handleViewPackage}
        onViewVersion={handleViewVersion}
      />

      <Dialog open={timelineDialogOpen} onClose={closeTimeline} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Package Timeline</Typography>
            <IconButton onClick={closeTimeline} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <HistoryTimeline timeline={timeline} loading={loadingTimeline} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTimeline}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={lifecycleDialogOpen} onClose={closeLifecycle} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Package Lifecycle</Typography>
            <IconButton onClick={closeLifecycle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <PackageLifecycleCard lifecycle={lifecycle} loading={loadingLifecycle} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLifecycle}>Close</Button>
        </DialogActions>
      </Dialog>

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

      <Backdrop
        open={actionLoading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {exporting ? 'Exporting report...' : printing ? 'Printing report...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageHistoryPage;