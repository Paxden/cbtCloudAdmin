/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
/**
 * Bulk Import Page
 * Main page for bulk question import
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import ImportStatsCards from '../../components/questionImport/ImportStatsCards';
import ImportSearch from '../../components/questionImport/ImportSearch';
import ImportFilters from '../../components/questionImport/ImportFilters';
import ImportHistoryTable from '../../components/questionImport/ImportHistoryTable';
import ImportUploadDialog from '../../components/questionImport/ImportUploadDialog';
import ImportDetailsDrawer from '../../components/questionImport/ImportDetailsDrawer';
import * as questionImportService from '../../services/questionImport/questionImportService';

// Helper function to get user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const BulkImport = () => {
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions
  const canUpload = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN' || userRole === 'EXAM_MANAGER';
  const canViewAll = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';

  // State
  const [imports, setImports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch imports
  const fetchImports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: searchTerm || undefined,
        ...filters,
      };

      // EXAM_MANAGER can only see their own imports
      if (userRole === 'EXAM_MANAGER') {
        params.userId = user?.id;
      }

      const response = await questionImportService.getImports(params);
      setImports(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load imports',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, filters, userRole, user?.id]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const params = {};
      if (userRole === 'EXAM_MANAGER') {
        params.userId = user?.id;
      }
      const response = await questionImportService.getImportStatistics(params);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, [userRole, user?.id]);

  // Initial load
  useEffect(() => {
    fetchImports();
    fetchStats();
  }, [fetchImports, fetchStats]);

  // Handle filters change
  const handleFilterChange = (newFilters) => {
    setPage(0);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setPage(0);
    setFilters({});
    setSearchTerm('');
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchImports();
    fetchStats();
  };

  // Handle upload
  const handleUpload = async (file, options) => {
    setUploadLoading(true);
    setUploadError(null);
    try {
      const response = await questionImportService.uploadQuestions(file, options);
      if (response.success) {
        setToast({
          open: true,
          message: response.message || 'Import completed successfully',
          severity: response.status === 'FAILED' ? 'error' : 'success',
        });
        setUploadDialogOpen(false);
        fetchImports();
        fetchStats();
      } else {
        throw new Error(response.message || 'Import failed');
      }
    } catch (error) {
      setUploadError(error.message || 'Upload failed');
      throw error;
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle view
  const handleView = (importItem) => {
    // Fetch full details
    const fetchDetails = async () => {
      try {
        const response = await questionImportService.getImportDetails(importItem._id);
        setSelectedImport(response.data);
        setDetailsDrawerOpen(true);
      } catch (error) {
        setToast({
          open: true,
          message: error.message || 'Failed to load import details',
          severity: 'error',
        });
      }
    };
    fetchDetails();
  };

  // Handle download
  const handleDownload = async (id) => {
    try {
      const blob = await questionImportService.downloadReport(id, 'json');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `import-report-${id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to download report',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Bulk Import"
        subtitle="Import questions from Excel, CSV, or JSON files"
        actions={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {canUpload && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Import Questions
              </Button>
            )}
          </Stack>
        }
      />

      {/* Statistics Cards */}
      <ImportStatsCards stats={stats} loading={loading} />

      {/* Search & Filters */}
      <ImportSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClear={() => {
          setSearchTerm('');
          setPage(0);
        }}
      />

      <ImportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        loading={loading}
      />

      {/* Import History Table */}
      <ImportHistoryTable
        imports={imports}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onView={handleView}
        onDownload={handleDownload}
        onRefresh={handleRefresh}
      />

      {/* Upload Dialog */}
      <ImportUploadDialog
        open={uploadDialogOpen}
        onClose={() => {
          setUploadDialogOpen(false);
          setUploadError(null);
        }}
        onUpload={handleUpload}
        loading={uploadLoading}
        error={uploadError}
      />

      {/* Details Drawer */}
      <ImportDetailsDrawer
        open={detailsDrawerOpen}
        importData={selectedImport}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedImport(null);
        }}
        onDownload={handleDownload}
      />

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkImport;