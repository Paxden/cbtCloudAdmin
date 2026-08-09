/* eslint-disable no-unused-vars */
/**
 * PackageValidationPage
 * Main page for package validation
 * 
 * Location: src/pages/package/PackageValidationPage.jsx
 */

import React, { useState } from 'react';
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
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePackageValidation } from '../../hooks/usePackageValidation';
import { useAuth } from '../../hooks/useAuth';

// Components
import ValidationSummaryCards from '../../components/packageValidation/ValidationSummaryCards';
import ValidationToolbar from '../../components/packageValidation/ValidationToolbar';
import ValidationFilters from '../../components/packageValidation/ValidationFilters';
import ValidationTable from '../../components/packageValidation/ValidationTable';
import ValidationDetailsDrawer from '../../components/packageValidation/ValidationDetailsDrawer';
import ValidationChecklist from '../../components/packageValidation/ValidationChecklist';
import ValidationResultDialog from '../../components/packageValidation/ValidationResultDialog';
import ValidationStatistics from '../../components/packageValidation/ValidationStatistics';

// Constants
const PAGE_TITLE = 'Package Validation';

// Helper function for user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const PackageValidationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions
  const canRunValidation = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canView = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN' || userRole === 'EXAM_MANAGER';

  // Use the hook
  const {
    validations,
    totalValidations,
    selectedValidation,
    checklist,
    statistics,
    validationResult,
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    runningValidation,
    detailsDrawerOpen,
    checklistDialogOpen,
    resultDialogOpen,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openChecklist,
    closeChecklist,
    runValidation,
    runBatchValidation,
    exportReport,
    closeResult,
    refresh
  } = usePackageValidation();

  // Local state
  const [selectedIds, setSelectedIds] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [runDialogOpen, setRunDialogOpen] = useState(false);

  // Count active filters
  const filterCount = Object.keys(filters).filter(
    key => !['page', 'limit', 'sort'].includes(key) && filters[key] && filters[key] !== ''
  ).length;

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle run validation
  const handleRunValidation = async (packageId) => {
    try {
      const result = await runValidation(packageId);
      showSnackbar('Validation completed successfully', 'success');
      if (detailsDrawerOpen) {
        closeDetails();
      }
      return result;
    } catch (err) {
      showSnackbar(err.message || 'Failed to run validation', 'error');
      throw err;
    }
  };

  // Handle batch validation
  const handleBatchValidation = async () => {
    if (selectedIds.length === 0) {
      showSnackbar('Please select packages to validate', 'warning');
      return;
    }

    try {
      await runBatchValidation(selectedIds);
      showSnackbar(`Validation completed for ${selectedIds.length} packages`, 'success');
      setSelectedIds([]);
      setRunDialogOpen(false);
    } catch (err) {
      showSnackbar(err.message || 'Failed to run batch validation', 'error');
    }
  };

  // Handle export report
  const handleExportReport = async (validationId, format = 'pdf') => {
    try {
      await exportReport(validationId, format);
      showSnackbar('Report exported successfully', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to export report', 'error');
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
      <ValidationSummaryCards
        statistics={statistics}
        loading={loadingStatistics}
      />

      {/* Toolbar */}
      <ValidationToolbar
        onRefresh={refresh}
        onRunValidation={() => setRunDialogOpen(true)}
        onExport={handleExportReport}
        totalCount={totalValidations}
        loading={isLoading || runningValidation}
        filterCount={filterCount}
        canRunValidation={canRunValidation}
        selectedIds={selectedIds}
      />

      {/* Filters */}
      <ValidationFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Table */}
      <ValidationTable
        validations={validations}
        total={totalValidations}
        page={filters.page}
        limit={filters.limit}
        loading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewDetails={openDetails}
        onRunValidation={handleRunValidation}
        onViewChecklist={openChecklist}
        onExportReport={handleExportReport}
        onSelect={setSelectedIds}
        selected={selectedIds}
        canRunValidation={canRunValidation}
      />

      {/* Statistics */}
      <Box sx={{ mt: 3 }}>
        <ValidationStatistics data={statistics} loading={loadingStatistics} />
      </Box>

      {/* Details Drawer */}
      <ValidationDetailsDrawer
        open={detailsDrawerOpen}
        onClose={closeDetails}
        validation={selectedValidation}
        loading={loadingDetails}
        onRunValidation={handleRunValidation}
        onExportReport={handleExportReport}
      />

      {/* Checklist Dialog */}
      <Dialog
        open={checklistDialogOpen}
        onClose={closeChecklist}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Validation Checklist</Typography>
            <IconButton onClick={closeChecklist} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ValidationChecklist checklist={checklist} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeChecklist}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Result Dialog */}
      <ValidationResultDialog
        open={resultDialogOpen}
        onClose={closeResult}
        result={validationResult}
        onViewPackage={() => handleViewPackage(validationResult?.packageId)}
        onRetry={() => {
          closeResult();
          if (validationResult?.packageId) {
            handleRunValidation(validationResult.packageId);
          }
        }}
      />

      {/* Run Batch Validation Dialog */}
      <Dialog open={runDialogOpen} onClose={() => setRunDialogOpen(false)}>
        <DialogTitle>Run Batch Validation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to run validation on {selectedIds.length} selected package(s).
            This process may take a few moments.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRunDialogOpen(false)} disabled={runningValidation}>
            Cancel
          </Button>
          <Button
            onClick={handleBatchValidation}
            color="primary"
            variant="contained"
            disabled={runningValidation || selectedIds.length === 0}
            startIcon={runningValidation && <CircularProgress size={20} />}
          >
            {runningValidation ? 'Running...' : 'Run Validation'}
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
        open={runningValidation}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            Running validation...
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageValidationPage;