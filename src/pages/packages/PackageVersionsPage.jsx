/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * PackageVersionsPage
 * Main page for package version management
 * 
 * Location: src/pages/package/PackageVersionsPage.jsx
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
  TextField,
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Close as CloseIcon } from '@mui/icons-material';
import { usePackageVersions } from '../../hooks/usePackageVersions';
import { useAuth } from '../../hooks/useAuth';

// Components
import VersionSummaryCards from '../../components/packageVersions/VersionSummaryCards';
import VersionToolbar from '../../components/packageVersions/VersionToolbar';
import VersionFilters from '../../components/packageVersions/VersionFilters';
import VersionTable from '../../components/packageVersions/VersionTable';
import VersionDetailsDrawer from '../../components/packageVersions/VersionDetailsDrawer';
import VersionTimeline from '../../components/packageVersions/VersionTimeline';
import VersionComparisonDialog from '../../components/packageVersions/VersionComparisonDialog';
import RegeneratePackageDialog from '../../components/packageVersions/RegeneratePackageDialog';

const PAGE_TITLE = 'Package Versions';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const PackageVersionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canRegenerate = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canArchive = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canView = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN' || userRole === 'EXAM_MANAGER';

  const {
    versions,
    totalVersions,
    selectedVersion,
    statistics,
    timeline,
    comparisonResult,
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    loadingTimeline,
    comparing,
    regenerating,
    detailsDrawerOpen,
    comparisonDialogOpen,
    regenerateDialogOpen,
    timelineDialogOpen,
    archiveDialogOpen,
    archiveReason,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openTimeline,
    closeTimeline,
    openComparison,
    closeComparison,
    openRegenerate,
    closeRegenerate,
    openArchive,
    closeArchive,
    handleRegenerate,
    handleArchive,
    exportReport,
    setArchiveReason,
    refresh
  } = usePackageVersions();

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

  const handleRegenerateConfirm = async (options) => {
    try {
      setActionLoading(true);
      await handleRegenerate(options);
      showSnackbar('Package regenerated successfully', 'success');
      closeRegenerate();
    } catch (err) {
      showSnackbar(err.message || 'Failed to regenerate package', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveConfirm = async () => {
    try {
      setActionLoading(true);
      await handleArchive();
      showSnackbar('Version archived successfully', 'success');
      closeArchive();
    } catch (err) {
      showSnackbar(err.message || 'Failed to archive version', 'error');
    } finally {
      setActionLoading(false);
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

      <VersionSummaryCards statistics={statistics} loading={loadingStatistics} />

      <VersionToolbar
        onRefresh={refresh}
        onRegenerate={() => {
          const activeVersion = versions.find(v => v.status === 'ACTIVE');
          if (activeVersion) {
            openRegenerate(activeVersion._id);
          } else {
            showSnackbar('No active version available for regeneration', 'warning');
          }
        }}
        onExport={exportReport}
        totalCount={totalVersions}
        loading={isLoading}
        filterCount={filterCount}
        canRegenerate={canRegenerate}
      />

      <VersionFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      <VersionTable
        versions={versions}
        total={totalVersions}
        page={filters.page}
        limit={filters.limit}
        loading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewDetails={openDetails}
        onCompare={openComparison}
        onRegenerate={openRegenerate}
        onViewTimeline={openTimeline}
        onArchive={openArchive}
        canRegenerate={canRegenerate}
        canArchive={canArchive}
      />

      <VersionDetailsDrawer
        open={detailsDrawerOpen}
        onClose={closeDetails}
        version={selectedVersion}
        loading={loadingDetails}
        onRegenerate={openRegenerate}
        onArchive={openArchive}
        canRegenerate={canRegenerate}
        canArchive={canArchive}
      />

      <VersionComparisonDialog
        open={comparisonDialogOpen}
        onClose={closeComparison}
        comparison={comparisonResult}
        loading={comparing}
      />

      <RegeneratePackageDialog
        open={regenerateDialogOpen}
        onClose={closeRegenerate}
        onConfirm={handleRegenerateConfirm}
        version={selectedVersion}
        loading={regenerating || actionLoading}
      />

      <Dialog open={timelineDialogOpen} onClose={closeTimeline} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Version Timeline</Typography>
            <IconButton onClick={closeTimeline} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <VersionTimeline timeline={timeline} loading={loadingTimeline} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTimeline}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={archiveDialogOpen} onClose={closeArchive}>
        <DialogTitle>Archive Version</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to archive this version? This action can be reverted if needed.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Archive Reason (Optional)"
            placeholder="Please provide a reason..."
            value={archiveReason}
            onChange={(e) => setArchiveReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeArchive} disabled={actionLoading}>Cancel</Button>
          <Button
            onClick={handleArchiveConfirm}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} />}
          >
            {actionLoading ? 'Archiving...' : 'Archive'}
          </Button>
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
        open={actionLoading || regenerating || comparing}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {regenerating ? 'Regenerating package...' : comparing ? 'Comparing versions...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageVersionsPage;