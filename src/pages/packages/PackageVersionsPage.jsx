/* eslint-disable no-unused-vars */

/**
 * PackageVersionManagementPage
 * Main page for managing package versions
 * 
 * Location: src/pages/version/PackageVersionManagementPage.jsx
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
  Add as AddIcon,
  CompareArrows as CompareIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Hooks
import {
  usePackageVersions,
  useCreateVersion,
  useActivateVersion,
  useArchiveVersion,
  useRevokeVersion,
  useCompareVersions,
} from '../../hooks/useVersion';

// Import packages hook
import { usePackageById } from '../../hooks/usePackage';

// Components
import VersionList from '../../components/version/VersionList';
import VersionStatusChip from '../../components/version/VersionStatusChip';
import CreateVersionDialog from '../../components/version/CreateVersionDialog';
import CompareVersionsDialog from '../../components/version/CompareVersionsDialog';
import VersionDetailsDrawer from '../../components/version/VersionDetailsDrawer';

// Types
import { VersionStatus, VersionStatusLabels } from '../../types/version.types';

const PackageVersionManagementPage = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  // Get package details
  const {
    data: packageData,
    loading: packageLoading,
    error: packageError,
    refetch: refetchPackage,
  } = usePackageById(packageId, {
    enabled: !!packageId,
  });

  // Get versions
  const versionsParams = useMemo(() => ({
    status: statusFilter || undefined,
    limit,
    page: page + 1,
  }), [statusFilter, limit, page]);

  const {
    data: versionsData,
    loading: versionsLoading,
    error: versionsError,
    refetch: refetchVersions,
  } = usePackageVersions(packageId, versionsParams, {
    enabled: !!packageId,
  });

  // Mutations
  const { createVersion, loading: creating, result: createResult } = useCreateVersion();
  const { activateVersion, loading: activating } = useActivateVersion();
  const { archiveVersion, loading: archiving } = useArchiveVersion();
  const { revokeVersion, loading: revoking } = useRevokeVersion();
  const { compareVersions, loading: comparing, result: compareResult } = useCompareVersions();

  const versions = versionsData?.data || [];
  const totalVersions = versionsData?.total || 0;

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

  const handleRefresh = useCallback(() => {
    refetchVersions();
    refetchPackage();
    showSnackbar('Refreshed successfully', 'success');
  }, [refetchVersions, refetchPackage, showSnackbar]);

  const handleViewVersion = useCallback((versionId) => {
    setSelectedVersionId(versionId);
    setDetailsDrawerOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setSelectedVersionId(null);
  }, []);

  const handleCreateVersion = useCallback(async (pkgId, data) => {
    try {
      await createVersion(pkgId, data);
      showSnackbar('Version created successfully!', 'success');
      setCreateDialogOpen(false);
      refetchVersions();
    } catch (error) {
      showSnackbar(error.message || 'Failed to create version', 'error');
    }
  }, [createVersion, refetchVersions, showSnackbar]);

  const handleActivateVersion = useCallback(async (versionId) => {
    try {
      await activateVersion(versionId);
      showSnackbar('Version activated successfully!', 'success');
      refetchVersions();
    } catch (error) {
      showSnackbar(error.message || 'Failed to activate version', 'error');
    }
  }, [activateVersion, refetchVersions, showSnackbar]);

  const handleArchiveVersion = useCallback(async (versionId) => {
    const reason = prompt('Please provide a reason for archiving this version:');
    if (reason !== null) {
      try {
        await archiveVersion(versionId, reason);
        showSnackbar('Version archived successfully!', 'success');
        refetchVersions();
      } catch (error) {
        showSnackbar(error.message || 'Failed to archive version', 'error');
      }
    }
  }, [archiveVersion, refetchVersions, showSnackbar]);

  const handleRevokeVersion = useCallback(async (versionId) => {
    const reason = prompt('Please provide a reason for revoking this version:');
    if (reason !== null) {
      try {
        await revokeVersion(versionId, reason);
        showSnackbar('Version revoked successfully!', 'success');
        refetchVersions();
      } catch (error) {
        showSnackbar(error.message || 'Failed to revoke version', 'error');
      }
    }
  }, [revokeVersion, refetchVersions, showSnackbar]);

  const handleCompareVersions = useCallback((versionId) => {
    setSelectedVersionId(versionId);
    setCompareDialogOpen(true);
  }, []);

  const handleCompare = useCallback(async (versionA, versionB) => {
    try {
      await compareVersions(versionA, versionB);
    } catch (error) {
      showSnackbar(error.message || 'Failed to compare versions', 'error');
    }
  }, [compareVersions, showSnackbar]);

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
        <Typography color="text.primary">Version Management</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Package Versions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {packageData?.packageCode || packageId}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={versionsLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Version
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      {packageData && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">
                  Current Version
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {packageData.currentVersionLabel || 'v1'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">
                  Total Versions
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalVersions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">
                  Active Version
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {versions.find(v => v.status === VersionStatus.ACTIVE)?.versionLabel || 'None'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">
                  Status
                </Typography>
                <VersionStatusChip status={packageData.status || VersionStatus.GENERATED} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search versions..."
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
            {Object.entries(VersionStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Version List */}
      <VersionList
        versions={versions}
        total={totalVersions}
        page={page}
        limit={limit}
        loading={versionsLoading}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setLimit(parseInt(e.target.value, 10));
          setPage(0);
        }}
        onViewVersion={handleViewVersion}
        onCompareVersions={handleCompareVersions}
        onActivate={handleActivateVersion}
        onArchive={handleArchiveVersion}
        onRevoke={handleRevokeVersion}
        canActivate={true}
        canArchive={true}
        canRevoke={true}
      />

      {/* Create Version Dialog */}
      <CreateVersionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        packageId={packageId}
        packageCode={packageData?.packageCode}
        onCreate={handleCreateVersion}
        loading={creating}
        error={null}
        result={createResult}
      />

      {/* Compare Versions Dialog */}
      <CompareVersionsDialog
        open={compareDialogOpen}
        onClose={() => {
          setCompareDialogOpen(false);
          setSelectedVersionId(null);
        }}
        versions={versions}
        onCompare={handleCompare}
        loading={comparing}
        error={null}
        result={compareResult}
      />

      {/* Version Details Drawer */}
      <VersionDetailsDrawer
        open={detailsDrawerOpen}
        onClose={handleCloseDetails}
        versionId={selectedVersionId}
        packageId={packageId}
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
        open={activating || archiving || revoking || creating}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {creating ? 'Creating version...' : 
             activating ? 'Activating version...' : 
             archiving ? 'Archiving version...' : 
             revoking ? 'Revoking version...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageVersionManagementPage;