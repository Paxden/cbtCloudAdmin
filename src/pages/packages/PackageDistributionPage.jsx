
/**
 * PackageDistributionPage
 * Main page for package distribution
 * 
 * Location: src/pages/package/PackageDistributionPage.jsx
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
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePackageDistribution } from '../../hooks/usePackageDistribution';
import { useAuth } from '../../hooks/useAuth';

// Components
import DistributionSummaryCards from '../../components/packageDistribution/DistributionSummaryCards';
import DistributionToolbar from '../../components/packageDistribution/DistributionToolbar';
import DistributionFilters from '../../components/packageDistribution/DistributionFilters';
import DistributionTable from '../../components/packageDistribution/DistributionTable';
import DistributionDetailsDrawer from '../../components/packageDistribution/DistributionDetailsDrawer';
import CentreDeliveryStatus from '../../components/packageDistribution/CentreDeliveryStatus';
import ReleasePackageDialog from '../../components/packageDistribution/ReleasePackageDialog';

// Constants
const PAGE_TITLE = 'Package Distribution';

// Helper function for user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const PackageDistributionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions
  const canRelease = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canRevoke = userRole === 'SUPER_ADMIN';
  const canView = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN' || userRole === 'EXAM_MANAGER';

  // Use the hook
  const {
    distributions,
    totalDistributions,
    selectedDistribution,
    centreDeliveryStatus,
    statistics,
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    releasing,
    revoking,
    detailsDrawerOpen,
    releaseDialogOpen,
    centreStatusDialogOpen,
    revokeDialogOpen,
    revokeReason,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openReleaseDialog,
    closeReleaseDialog,
    openCentreStatus,
    closeCentreStatus,
    openRevokeDialog,
    closeRevokeDialog,
    releasePackage,
    releaseBatchPackages,
    revokeDistribution,
    exportReport,
    setRevokeReason,
    refresh
  } = usePackageDistribution();

  // Local state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Count active filters
  const filterCount = Object.keys(filters).filter(
    key => !['page', 'limit', 'sort'].includes(key) && filters[key] && filters[key] !== ''
  ).length;

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle release packages
  const handleReleasePackages = async (options) => {
    try {
      setActionLoading(true);
      
      if (selectedIds.length === 1) {
        // Single release
        const packageId = selectedIds[0];
        await releasePackage(packageId, {
          notes: options.notes,
          expiryDays: options.expiryDays
        });
        showSnackbar('Package released successfully', 'success');
      } else {
        // Batch release
        await releaseBatchPackages(selectedIds, {
          notes: options.notes,
          expiryDays: options.expiryDays
        });
        showSnackbar(`${selectedIds.length} packages released successfully`, 'success');
      }
      
      setSelectedIds([]);
      closeReleaseDialog();
    } catch (err) {
      showSnackbar(err.message || 'Failed to release packages', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle revoke distribution
  const handleRevokeDistribution = async () => {
    if (!selectedDistribution) return;

    try {
      setActionLoading(true);
      await revokeDistribution(selectedDistribution._id, revokeReason);
      showSnackbar('Distribution revoked successfully', 'success');
      closeRevokeDialog();
    } catch (err) {
      showSnackbar(err.message || 'Failed to revoke distribution', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle export
  const handleExport = async (format) => {
    try {
      await exportReport(format);
      showSnackbar('Report exported successfully', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to export report', 'error');
    }
  };

  // Handle release button click
  const handleReleaseClick = () => {
    // Get selected packages data
    const selectedPkgs = distributions
      .filter(d => selectedIds.includes(d._id))
      .map(d => ({
        id: d._id,
        name: d.packageName || d.package?.name,
        version: d.packageVersion || d.version,
        centreName: d.centreName || d.centre?.name,
        candidateCount: d.candidateCount
      }));
    
    setSelectedPackages(selectedPkgs);
    openReleaseDialog();
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
      <DistributionSummaryCards
        statistics={statistics}
        loading={loadingStatistics}
      />

      {/* Toolbar */}
      <DistributionToolbar
        onRefresh={refresh}
        onRelease={handleReleaseClick}
        onExport={handleExport}
        totalCount={totalDistributions}
        loading={isLoading || releasing}
        filterCount={filterCount}
        canRelease={canRelease}
        selectedIds={selectedIds}
      />

      {/* Filters */}
      <DistributionFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Table */}
      <DistributionTable
        distributions={distributions}
        total={totalDistributions}
        page={filters.page}
        limit={filters.limit}
        loading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewDetails={openDetails}
        onRelease={handleReleaseClick}
        onViewCentreStatus={openCentreStatus}
        onRevoke={openRevokeDialog}
        onSelect={setSelectedIds}
        selected={selectedIds}
        canRelease={canRelease}
        canRevoke={canRevoke}
      />

      {/* Details Drawer */}
      <DistributionDetailsDrawer
        open={detailsDrawerOpen}
        onClose={closeDetails}
        distribution={selectedDistribution}
        loading={loadingDetails}
        onRelease={() => {
          if (selectedDistribution) {
            setSelectedPackages([{
              id: selectedDistribution._id,
              name: selectedDistribution.packageName || selectedDistribution.package?.name,
              version: selectedDistribution.packageVersion || selectedDistribution.version,
              centreName: selectedDistribution.centreName || selectedDistribution.centre?.name,
              candidateCount: selectedDistribution.candidateCount
            }]);
            openReleaseDialog();
          }
        }}
        onRevoke={() => {
          if (selectedDistribution) {
            openRevokeDialog(selectedDistribution._id);
          }
        }}
        canRelease={canRelease}
        canRevoke={canRevoke}
      />

      {/* Centre Status Dialog */}
      <Dialog
        open={centreStatusDialogOpen}
        onClose={closeCentreStatus}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Centre Delivery Status</Typography>
            <IconButton onClick={closeCentreStatus} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <CentreDeliveryStatus status={centreDeliveryStatus} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCentreStatus}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Release Dialog */}
      <ReleasePackageDialog
        open={releaseDialogOpen}
        onClose={closeReleaseDialog}
        onConfirm={handleReleasePackages}
        packages={selectedPackages}
        loading={actionLoading || releasing}
        error={null}
      />

      {/* Revoke Dialog */}
      <Dialog open={revokeDialogOpen} onClose={closeRevokeDialog}>
        <DialogTitle>Revoke Distribution</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to revoke this distribution? 
            This will prevent further downloads and access to the package.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Reason for Revocation (Optional)"
            placeholder="Please provide a reason..."
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRevokeDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleRevokeDistribution}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} />}
          >
            {actionLoading ? 'Revoking...' : 'Revoke'}
          </Button>
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
        open={actionLoading || releasing || revoking}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {releasing ? 'Releasing packages...' : revoking ? 'Revoking distribution...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageDistributionPage;