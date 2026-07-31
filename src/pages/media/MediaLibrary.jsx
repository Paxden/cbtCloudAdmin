/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable preserve-caught-error */
/**
 * Media Library Page
 * Main page for managing media files
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
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  GridView as GridIcon,
  TableRows as TableIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import MediaStatsCards from '../../components/media/MediaStatsCards';
import MediaSearch from '../../components/media/MediaSearch';
import MediaFilters from '../../components/media/MediaFilters';
import MediaGrid from '../../components/media/MediaGrid';
import MediaTable from '../../components/media/MediaTable';
import MediaUploadDialog from '../../components/media/MediaUploadDialog';
import MediaPreviewDialog from '../../components/media/MediaPreviewDialog';
import MediaDetailsDrawer from '../../components/media/MediaDetailsDrawer';
import ReplaceMediaDialog from '../../components/media/ReplaceMediaDialog';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import * as mediaService from '../../services/media/mediaService';

// Helper function to get user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const MediaLibrary = () => {
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions
  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canDelete = userRole === 'SUPER_ADMIN';
  const canArchive = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canRestore = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canView = true;
  const canUpload = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';

  // View mode
  const [viewMode, setViewMode] = useState('grid');

  // State
  const [media, setMedia] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaToActOn, setMediaToActOn] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch media
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: searchTerm || undefined,
        ...filters,
      };

      // EXAM_MANAGER can only see active media
      if (userRole === 'EXAM_MANAGER') {
        params.status = 'ACTIVE';
      }

      const response = await mediaService.getMedia(params);
      setMedia(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load media',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, filters, userRole]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await mediaService.getMediaStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMedia();
    fetchStats();
  }, [fetchMedia, fetchStats]);

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
    fetchMedia();
    fetchStats();
  };

  // Handle upload
  const handleUpload = async (file, altText) => {
    setUploadLoading(true);
    try {
      const response = await mediaService.uploadMedia(file, altText);
      if (response.success) {
        setToast({
          open: true,
          message: response.duplicate ? 'Image already exists' : 'Image uploaded successfully',
          severity: 'success',
        });
        setUploadDialogOpen(false);
        fetchMedia();
        fetchStats();
      }
    } catch (error) {
      throw new Error(error.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle view
  const handleView = (item) => {
    setSelectedMedia(item);
    setPreviewDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (item) => {
    setSelectedMedia(item);
    setDrawerOpen(true);
  };

  // Handle update
  const handleUpdate = async (id, data) => {
    try {
      const response = await mediaService.updateMedia(id, data);
      if (response.success) {
        setToast({
          open: true,
          message: 'Media updated successfully',
          severity: 'success',
        });
        setDrawerOpen(false);
        fetchMedia();
        fetchStats();
      }
    } catch (error) {
      throw new Error(error.message || 'Update failed');
    }
  };

  // Handle replace
  const handleReplace = (item) => {
    setSelectedMedia(item);
    setReplaceDialogOpen(true);
  };

  const confirmReplace = async (file) => {
    setActionLoading(true);
    try {
      const response = await mediaService.replaceMedia(selectedMedia._id, file);
      if (response.success) {
        setToast({
          open: true,
          message: 'Image replaced successfully',
          severity: 'success',
        });
        setReplaceDialogOpen(false);
        fetchMedia();
        fetchStats();
      }
    } catch (error) {
      throw new Error(error.message || 'Replace failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle archive
  const handleArchive = (id) => {
    setMediaToActOn(id);
    setArchiveDialogOpen(true);
  };

  const confirmArchive = async () => {
    setActionLoading(true);
    try {
      const response = await mediaService.archiveMedia(mediaToActOn);
      if (response.success) {
        setToast({
          open: true,
          message: 'Media archived successfully',
          severity: 'success',
        });
        setArchiveDialogOpen(false);
        fetchMedia();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to archive',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
      setMediaToActOn(null);
    }
  };

  // Handle restore
  const handleRestore = (id) => {
    setMediaToActOn(id);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = async () => {
    setActionLoading(true);
    try {
      const response = await mediaService.restoreMedia(mediaToActOn);
      if (response.success) {
        setToast({
          open: true,
          message: 'Media restored successfully',
          severity: 'success',
        });
        setRestoreDialogOpen(false);
        fetchMedia();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to restore',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
      setMediaToActOn(null);
    }
  };

  // Handle delete permanent
  const handleDelete = (id) => {
    setMediaToActOn(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      const response = await mediaService.deleteMedia(mediaToActOn);
      if (response.success) {
        setToast({
          open: true,
          message: 'Media deleted permanently',
          severity: 'success',
        });
        setDeleteDialogOpen(false);
        fetchMedia();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to delete',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
      setMediaToActOn(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Media Library"
        subtitle="Manage reusable images for questions and exams"
        actions={
          <Stack direction="row" spacing={1}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="table">
                <TableIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

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
                Upload
              </Button>
            )}
          </Stack>
        }
      />

      {/* Statistics Cards */}
      <MediaStatsCards stats={stats} loading={loading} />

      {/* Search & Filters */}
      <MediaSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClear={() => {
          setSearchTerm('');
          setPage(0);
        }}
      />

      <MediaFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        loading={loading}
      />

      {/* Media Display */}
      {viewMode === 'grid' ? (
        <MediaGrid
          media={media}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onDelete={handleDelete}
          canEdit={canEdit}
          canDelete={canDelete}
          canArchive={canArchive}
          canRestore={canRestore}
        />
      ) : (
        <MediaTable
          media={media}
          loading={loading}
          page={page}
          limit={limit}
          total={total}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onView={handleView}
          onEdit={handleEdit}
          onReplace={handleReplace}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          canEdit={canEdit}
          canDelete={canDelete}
          canArchive={canArchive}
          canRestore={canRestore}
        />
      )}

      {/* Upload Dialog */}
      <MediaUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
        loading={uploadLoading}
      />

      {/* Preview Dialog */}
      <MediaPreviewDialog
        open={previewDialogOpen}
        media={selectedMedia}
        onClose={() => setPreviewDialogOpen(false)}
      />

      {/* Edit Drawer */}
      <MediaDetailsDrawer
        open={drawerOpen}
        media={selectedMedia}
        onClose={() => setDrawerOpen(false)}
        onUpdate={handleUpdate}
      />

      {/* Replace Dialog */}
      <ReplaceMediaDialog
        open={replaceDialogOpen}
        media={selectedMedia}
        onClose={() => setReplaceDialogOpen(false)}
        onReplace={confirmReplace}
        loading={actionLoading}
      />

      {/* Archive Confirmation */}
      <ConfirmDialog
        open={archiveDialogOpen}
        onClose={() => setArchiveDialogOpen(false)}
        onConfirm={confirmArchive}
        title="Archive Media?"
        message="This media will be archived. It will no longer be available for selection in questions. This action can be reversed."
        confirmText="Archive"
        confirmColor="warning"
        severity="warning"
        loading={actionLoading}
      />

      {/* Restore Confirmation */}
      <ConfirmDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
        title="Restore Media?"
        message="This media will be restored and become available for use in questions."
        confirmText="Restore"
        confirmColor="success"
        severity="info"
        loading={actionLoading}
      />

      {/* Delete Permanently Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Permanently?"
        message="This media will be permanently deleted. This action cannot be undone."
        confirmText="Delete Permanently"
        confirmColor="error"
        severity="error"
        loading={actionLoading}
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

export default MediaLibrary;