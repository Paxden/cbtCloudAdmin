/* eslint-disable no-unused-vars */
/**
 * CandidatePapersPage
 * Main page for candidate paper management
 * 
 * Location: src/pages/packages/CandidatePapersPage.jsx
 */

import { useState } from 'react';
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
  TextField,
  IconButton
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCandidatePapers } from '../../hooks/useCandidatePaper';
import { useAuth } from '../../hooks/useAuth';

// Components
import CandidatePaperSummaryCards from '../../components/candidate-paper/CandidatePaperSummaryCards';
import CandidatePaperToolbar from '../../components/candidate-paper/CandidatePaperToolbar';
import CandidatePaperFilters from '../../components/candidate-paper/CandidatePaperFilters';
import CandidatePaperTable from '../../components/candidate-paper/CandidatePaperTable';
import CandidatePaperDetailsDrawer from '../../components/candidate-paper/CandidatePaperDetailsDrawer';
import CandidatePaperPreviewDialog from '../../components/candidate-paper/CandidatePaperPreviewDialog';
import RandomizationSummaryCard from '../../components/candidate-paper/RandomizationSummaryCard';
import GeneratePaperDialog from '../../components/candidate-paper/GeneratePaperDialog';

// Constants
const PAGE_TITLE = 'Candidate Papers';

// Helper function for user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const CandidatePapersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions
  const canValidate = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canArchive = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canView = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN' || userRole === 'EXAM_MANAGER';
  const canGenerate = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';

  // Use the hook
  const {
    papers,
    totalPapers,
    statistics,
    selectedPaper,
    previewData,
    randomizationData,
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    detailsDrawerOpen,
    previewDialogOpen,
    randomizationDialogOpen,
    generateDialogOpen,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openPreview,
    closePreview,
    openRandomization,
    closeRandomization,
    openGenerateDialog,
    closeGenerateDialog,
    validatePaper,
    archivePaper,
    exportPapers,
    refresh,
    generatePaper,
    generateCentrePapers,
    generateAllPapers,
    generating,
    generateResult,
    availableInstances,
    availableCentres,
    availableCandidates,
  } = useCandidatePapers();

  // Local state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Count active filters
  const filterCount = Object.keys(filters).filter(
    key => !['page', 'limit', 'sort'].includes(key) && filters[key] && filters[key] !== ''
  ).length;

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle validate
  const handleValidate = async (paperId) => {
    try {
      setActionLoading(true);
      await validatePaper(paperId);
      showSnackbar('Paper validated successfully', 'success');
      if (detailsDrawerOpen) {
        closeDetails();
      }
      refresh();
    } catch (err) {
      showSnackbar(err.message || 'Failed to validate paper', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle archive
  const handleArchive = async (paperId, reason = '') => {
    try {
      setActionLoading(true);
      await archivePaper(paperId, reason);
      showSnackbar('Paper archived successfully', 'success');
      if (detailsDrawerOpen) {
        closeDetails();
      }
      setArchiveDialogOpen(false);
      refresh();
    } catch (err) {
      showSnackbar(err.message || 'Failed to archive paper', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle download metadata
  const handleDownload = (paperId) => {
    showSnackbar('Download functionality coming soon', 'info');
  };

  // Handle generate paper
  const handleGeneratePaper = async (data) => {
    try {
      await generatePaper(data);
      showSnackbar('Paper generated successfully', 'success');
      closeGenerateDialog();
      refresh();
    } catch (err) {
      showSnackbar(err.message || 'Failed to generate paper', 'error');
    }
  };

  const handleGenerateCentrePapers = async (data) => {
    try {
      await generateCentrePapers(data);
      showSnackbar('Centre papers generated successfully', 'success');
      closeGenerateDialog();
      refresh();
    } catch (err) {
      showSnackbar(err.message || 'Failed to generate centre papers', 'error');
    }
  };

  const handleGenerateAllPapers = async (data) => {
    try {
      await generateAllPapers(data);
      showSnackbar('All papers generated successfully', 'success');
      closeGenerateDialog();
      refresh();
    } catch (err) {
      showSnackbar(err.message || 'Failed to generate all papers', 'error');
    }
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
      <CandidatePaperSummaryCards
        statistics={statistics}
        loading={loadingStatistics}
      />

      {/* Toolbar */}
      <CandidatePaperToolbar
        onRefresh={refresh}
        onExport={exportPapers}
        onGenerate={openGenerateDialog}
        totalCount={totalPapers}
        loading={isLoading}
        filterCount={filterCount}
        canGenerate={canGenerate}
      />

      {/* Filters */}
      <CandidatePaperFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Table */}
      <CandidatePaperTable
        papers={papers}
        total={totalPapers}
        page={filters.page}
        limit={filters.limit}
        loading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewDetails={openDetails}
        onPreview={openPreview}
        onRandomization={openRandomization}
        onDownload={handleDownload}
        onValidate={handleValidate}
        onArchive={(paperId) => {
          setSelectedPaperId(paperId);
          setArchiveDialogOpen(true);
        }}
        canValidate={canValidate}
        canArchive={canArchive}
      />

      {/* Generate Paper Dialog */}
      <GeneratePaperDialog
        open={generateDialogOpen}
        onClose={closeGenerateDialog}
        instances={availableInstances || []}
        centres={availableCentres || []}
        candidates={availableCandidates || []}
        onGenerate={handleGeneratePaper}
        onGenerateCentre={handleGenerateCentrePapers}
        onGenerateAll={handleGenerateAllPapers}
        loading={generating}
        error={null}
        result={generateResult}
      />

      {/* Details Drawer */}
      <CandidatePaperDetailsDrawer
        open={detailsDrawerOpen}
        onClose={closeDetails}
        paper={selectedPaper}
        loading={loadingDetails}
        onValidate={handleValidate}
        onArchive={(paperId) => {
          closeDetails();
          setSelectedPaperId(paperId);
          setArchiveDialogOpen(true);
        }}
      />

      {/* Preview Dialog */}
      <CandidatePaperPreviewDialog
        open={previewDialogOpen}
        onClose={closePreview}
        preview={previewData}
        loading={!previewData}
      />

      {/* Randomization Dialog */}
      <Dialog
        open={randomizationDialogOpen}
        onClose={closeRandomization}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Randomization Summary</Typography>
            <IconButton onClick={closeRandomization} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <RandomizationSummaryCard data={randomizationData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRandomization}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Archive Paper</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to archive this paper? This action can be reverted.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Reason for Archiving (Optional)"
            placeholder="Please provide a reason..."
            value={archiveReason}
            onChange={(e) => setArchiveReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => handleArchive(selectedPaperId, archiveReason)}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} />}
          >
            {actionLoading ? 'Archiving...' : 'Archive'}
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
        open={actionLoading || generating}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {generating ? 'Generating papers...' : 'Processing...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default CandidatePapersPage;