/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Subjects Page
 * Main page for managing subjects
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import AppPageHeader from '../../../components/common/AppPageHeader';
import SubjectStatsCards from '../../../components/questionBank/subjects/SubjectStatsCards';
import SubjectSearch from '../../../components/questionBank/subjects/SubjectSearch';
import SubjectFilters from '../../../components/questionBank/subjects/SubjectFilters';
import SubjectTable from '../../../components/questionBank/subjects/SubjectTable';
import SubjectFormDialog from '../../../components/questionBank/subjects/SubjectFormDialog';
import SubjectDetailsDrawer from '../../../components/questionBank/subjects/SubjectDetailsDrawer';
import ConfirmDialog from '../../../components/dialogs/ConfirmDialog';
import * as subjectService from '../../../services/questionBank/subjectService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};


const Subjects = () => {
  const { user } = useAuth();
 // ✅ FIX: Get role name from the role object
  const userRole = getUserRole(user);
  


  // Permissions
  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canDelete = userRole === 'SUPER_ADMIN';
  const canManageStatus = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canView = true;



  // State
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSubject, setDrawerSubject] = useState(null);
  const [drawerStats, setDrawerStats] = useState({ topics: 0, questions: 0 });

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        status: statusFilter || undefined,
      };

      const response = await subjectService.getSubjects(params);
      setSubjects(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setToast({
        open: true,
        message: error.message || 'Failed to load subjects',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedCategory, statusFilter]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await subjectService.getSubjectStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSubjects();
    fetchStats();
  }, [fetchSubjects, fetchStats]);

  // Handle filters
  useEffect(() => {
    setPage(0);
    fetchSubjects();
  }, [searchTerm, selectedCategory, statusFilter, fetchSubjects]);

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
    fetchSubjects();
    fetchStats();
  };

  // Handle view
  const handleView = (subject) => {
    setDrawerSubject(subject);
    setDrawerStats({ topics: 0, questions: 0 });
    setDrawerOpen(true);
  };

  // Handle create
  const handleCreate = () => {
    setSelectedSubject(null);
    setFormMode('create');
    setFormError(null);
    setFormDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setFormMode('edit');
    setFormError(null);
    setFormDialogOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setFormError(null);

    try {
      let response;
      if (formMode === 'create') {
        response = await subjectService.createSubject(data);
      } else {
        response = await subjectService.updateSubject(selectedSubject._id, data);
      }

      if (response.success) {
        setToast({
          open: true,
          message: formMode === 'create'
            ? 'Subject created successfully'
            : 'Subject updated successfully',
          severity: 'success',
        });
        setFormDialogOpen(false);
        fetchSubjects();
        fetchStats();
      }
    } catch (error) {
      setFormError(error.message || 'Failed to save subject');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle activate
  const handleActivate = async (id) => {
    try {
      const response = await subjectService.activateSubject(id);
      if (response.success) {
        setToast({
          open: true,
          message: 'Subject activated successfully',
          severity: 'success',
        });
        fetchSubjects();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to activate subject',
        severity: 'error',
      });
    }
  };

  // Handle deactivate
  const handleDeactivate = async (id) => {
    try {
      const response = await subjectService.deactivateSubject(id);
      if (response.success) {
        setToast({
          open: true,
          message: 'Subject deactivated successfully',
          severity: 'success',
        });
        fetchSubjects();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to deactivate subject',
        severity: 'error',
      });
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setSubjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await subjectService.deleteSubject(subjectToDelete);
      if (response.success) {
        setToast({
          open: true,
          message: 'Subject archived successfully',
          severity: 'success',
        });
        setDeleteDialogOpen(false);
        fetchSubjects();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to archive subject',
        severity: 'error',
      });
    } finally {
      setDeleteLoading(false);
      setSubjectToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Subjects"
        subtitle="Manage examination subjects organized by categories"
        actions={
          canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              New Subject
            </Button>
          )
        }
      />

      {/* Statistics Cards */}
      <SubjectStatsCards stats={stats} loading={loading} />

      {/* Search & Filters */}
      <SubjectSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClear={() => setSearchTerm('')}
      />

      <SubjectFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClear={() => {
          setSelectedCategory('');
          setStatusFilter('');
          setSearchTerm('');
        }}
      />

      {/* Table */}
      <SubjectTable
        subjects={subjects}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onView={handleView}
        onEdit={handleEdit}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        canEdit={canEdit}
        canDelete={canDelete}
        canManageStatus={canManageStatus}
        canView={canView}
      />

      {/* Create/Edit Dialog */}
      <SubjectFormDialog
        open={formDialogOpen}
        subject={selectedSubject}
        mode={formMode}
        loading={formLoading}
        error={formError}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Details Drawer */}
      <SubjectDetailsDrawer
        open={drawerOpen}
        subject={drawerSubject}
        onClose={() => setDrawerOpen(false)}
        loading={false}
        stats={drawerStats}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Archive Subject?"
        message="This will archive the subject. It will no longer be available for selection when creating topics or questions. This action can be reversed by reactivating the subject."
        confirmText="Archive"
        confirmColor="error"
        severity="warning"
        loading={deleteLoading}
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

export default Subjects;