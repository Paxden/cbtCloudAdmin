/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Question Categories Page
 * Main page for managing question categories
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import AppPageHeader from '../../../components/common/AppPageHeader';
import CategoryStatsCards from '../../../components/questionBank/categories/CategoryStatsCards';
import CategorySearch from '../../../components/questionBank/categories/CategorySearch';
import CategoryFilters from '../../../components/questionBank/categories/CategoryFilters';
import CategoryTable from '../../../components/questionBank/categories/CategoryTable';
import CategoryFormDialog from '../../../components/questionBank/categories/CategoryFormDialog';
import CategoryDetailsDrawer from '../../../components/questionBank/categories/CategoryDetailsDrawer';
import ConfirmDialog from '../../../components/dialogs/ConfirmDialog';
import * as categoryService from '../../../services/questionBank/categoryService';

// Helper to get role name from user object
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const QuestionCategories = () => {
  const { user } = useAuth();
  
  // ✅ FIX: Get role name from the role object
  const userRole = getUserRole(user);
  
  // Debug - log to check what's happening
  console.log('🔍 Categories Page - User:', user);
  console.log('🔍 Categories Page - User Role:', userRole);

  // Permissions
  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canDelete = userRole === 'SUPER_ADMIN';
  const canManageStatus = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canView = true;

  // State
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState(null);
  const [drawerStats, setDrawerStats] = useState({ subjects: 0, questions: 0 });

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      };

      const response = await categoryService.getCategories(params);
      setCategories(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setToast({
        open: true,
        message: error.message || 'Failed to load categories',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await categoryService.getCategoryStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [fetchCategories, fetchStats]);

  // Handle filters
  useEffect(() => {
    setPage(0);
    fetchCategories();
  }, [searchTerm, statusFilter, fetchCategories]);

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
    fetchCategories();
    fetchStats();
  };

  // Handle view
  const handleView = (category) => {
    setDrawerCategory(category);
    // Fetch stats for the category
    // In production, this would come from an API endpoint
    setDrawerStats({ subjects: 0, questions: 0 });
    setDrawerOpen(true);
  };

  // Handle create
  const handleCreate = () => {
    setSelectedCategory(null);
    setFormMode('create');
    setFormError(null);
    setFormDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (category) => {
    setSelectedCategory(category);
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
        response = await categoryService.createCategory(data);
      } else {
        response = await categoryService.updateCategory(selectedCategory._id, data);
      }

      if (response.success) {
        setToast({
          open: true,
          message: formMode === 'create'
            ? 'Category created successfully'
            : 'Category updated successfully',
          severity: 'success',
        });
        setFormDialogOpen(false);
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      setFormError(error.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle activate
  const handleActivate = async (id) => {
    try {
      const response = await categoryService.activateCategory(id);
      if (response.success) {
        setToast({
          open: true,
          message: 'Category activated successfully',
          severity: 'success',
        });
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to activate category',
        severity: 'error',
      });
    }
  };

  // Handle deactivate
  const handleDeactivate = async (id) => {
    try {
      const response = await categoryService.deactivateCategory(id);
      if (response.success) {
        setToast({
          open: true,
          message: 'Category deactivated successfully',
          severity: 'success',
        });
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to deactivate category',
        severity: 'error',
      });
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await categoryService.deleteCategory(categoryToDelete);
      if (response.success) {
        setToast({
          open: true,
          message: 'Category archived successfully',
          severity: 'success',
        });
        setDeleteDialogOpen(false);
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to archive category',
        severity: 'error',
      });
    } finally {
      setDeleteLoading(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Question Categories"
        subtitle="Manage examination categories for the question bank"
        actions={
          canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              New Category
            </Button>
          )
        }
      />

      {/* Statistics Cards */}
      <CategoryStatsCards stats={stats} loading={loading} />

      {/* Search & Filters */}
      <CategorySearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClear={() => setSearchTerm('')}
      />

      <CategoryFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClear={() => {
          setStatusFilter('');
          setSearchTerm('');
        }}
      />

      {/* Table */}
      <CategoryTable
        categories={categories}
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
      <CategoryFormDialog
        open={formDialogOpen}
        category={selectedCategory}
        mode={formMode}
        loading={formLoading}
        error={formError}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Details Drawer */}
      <CategoryDetailsDrawer
        open={drawerOpen}
        category={drawerCategory}
        onClose={() => setDrawerOpen(false)}
        loading={false}
        stats={drawerStats}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Archive Category?"
        message="This will archive the category. It will no longer be available for selection when creating subjects or questions. This action can be reversed by reactivating the category."
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

export default QuestionCategories;