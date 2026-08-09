/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/preserve-manual-memoization */
/**
 * useInstances Hook
 * Manages examination instances state and operations
 * 
 * Location: src/hooks/useInstances.js
 */

import { useState, useEffect, useCallback,  } from 'react';
import * as examInstanceService from '../services//instances/instanceService';

export const useInstances = () => {
  // State
  const [instances, setInstances] = useState([]);
  const [totalInstances, setTotalInstances] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [validatedExaminations, setValidatedExaminations] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  
  // Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Filter state
  const [filters, setFilters] = useState({
    page: 0,
    limit: 10,
    search: '',
    status: '',
    examId: '',
    sort: 'createdAt',
    sortOrder: -1,
  });

  // Fetch instances with filters
  const fetchInstances = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: filters.page + 1,
        limit: filters.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        examId: filters.examId || undefined,
        sort: filters.sort,
        sortOrder: filters.sortOrder,
      };
      
      const result = await examInstanceService.getInstances(params);
      
      // Handle both array and object response formats
      const dataArray = Array.isArray(result) ? result : (result.data || []);
      const total = result.meta?.total || result.total || dataArray.length;
      
      setInstances(dataArray);
      setTotalInstances(total);
    } catch (error) {
      console.error('Failed to load instances:', error);
      showSnackbar(error.message || 'Failed to load instances', 'error');
      setInstances([]);
      setTotalInstances(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const result = await examInstanceService.getInstanceStatistics();
      // Handle response - backend returns { total, draft, generating, generated, locked, archived }
      setStatistics(result);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      // Set default statistics to prevent UI errors
      setStatistics({
        total: 0,
        draft: 0,
        generating: 0,
        generated: 0,
        locked: 0,
        archived: 0,
      });
    }
  }, []);

  // Fetch validated examinations (for create dialog)
  const fetchValidatedExaminations = useCallback(async () => {
    try {
      // Placeholder - you'll need to implement this
      setValidatedExaminations([
        { _id: '1', code: 'EXAM-001', name: 'Mathematics 2024', status: 'VALIDATED' },
        { _id: '2', code: 'EXAM-002', name: 'Physics 2024', status: 'VALIDATED' },
      ]);
    } catch (error) {
      console.error('Failed to load validated examinations:', error);
    }
  }, []);

  // Load data on mount and filter changes
  useEffect(() => {
    fetchInstances();
    fetchStatistics();
    fetchValidatedExaminations();
  }, [fetchInstances, fetchStatistics, fetchValidatedExaminations]);

  // Refresh all data
  const refresh = useCallback(() => {
    fetchInstances();
    fetchStatistics();
    fetchValidatedExaminations();
  }, [fetchInstances, fetchStatistics, fetchValidatedExaminations]);

  // Filter handlers
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0, // Reset to first page on filter change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 0,
      limit: 10,
      search: '',
      status: '',
      examId: '',
      sort: 'createdAt',
      sortOrder: -1,
    });
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((event, newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 0,
    }));
  }, []);

  // Dialog handlers
  const openCreateDialog = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const closeCreateDialog = useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  const openDetails = useCallback(async (instanceId) => {
    setSelectedInstanceId(instanceId);
    setDetailsDrawerOpen(true);
    
    try {
      const instance = await examInstanceService.getInstanceById(instanceId);
      setSelectedInstance(instance);
    } catch (error) {
      showSnackbar(error.message || 'Failed to load instance details', 'error');
      setDetailsDrawerOpen(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setSelectedInstance(null);
    setSelectedInstanceId(null);
  }, []);

  const openArchiveDialog = useCallback((instanceId) => {
    setSelectedInstanceId(instanceId);
    setArchiveReason('');
    setArchiveDialogOpen(true);
  }, []);

  const closeArchiveDialog = useCallback(() => {
    setArchiveDialogOpen(false);
    setSelectedInstanceId(null);
    setArchiveReason('');
  }, []);

  // Snackbar helper
  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  }, []);

  // ============================================================
  // MUTATIONS
  // ============================================================

  // Create instance
  const handleCreateInstance = useCallback(async (examId, notes) => {
    setIsCreating(true);
    try {
      const result = await examInstanceService.createInstance({ examId, notes });
      showSnackbar(`Instance ${result.instanceCode} created successfully`, 'success');
      closeCreateDialog();
      refresh();
      return result;
    } catch (error) {
      showSnackbar(error.message || 'Failed to create instance', 'error');
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [refresh, closeCreateDialog]);

  // Lock instance
  const handleLock = useCallback(async (instanceId) => {
    setIsLocking(true);
    try {
      const result = await examInstanceService.lockInstance(instanceId);
      showSnackbar(`Instance ${result.instanceCode} locked successfully`, 'success');
      refresh();
      if (detailsDrawerOpen) {
        // Refresh details if drawer is open
        const updated = await examInstanceService.getInstanceById(instanceId);
        setSelectedInstance(updated);
      }
      return result;
    } catch (error) {
      showSnackbar(error.message || 'Failed to lock instance', 'error');
      throw error;
    } finally {
      setIsLocking(false);
    }
  }, [refresh, detailsDrawerOpen]);

  // Archive instance
  const handleArchiveConfirm = useCallback(async () => {
    if (!selectedInstanceId) return;
    
    setIsArchiving(true);
    try {
      const result = await examInstanceService.archiveInstance(
        selectedInstanceId,
        archiveReason
      );
      showSnackbar(`Instance ${result.instanceCode} archived successfully`, 'success');
      closeArchiveDialog();
      refresh();
      if (detailsDrawerOpen) {
        closeDetails();
      }
      return result;
    } catch (error) {
      showSnackbar(error.message || 'Failed to archive instance', 'error');
      throw error;
    } finally {
      setIsArchiving(false);
    }
  }, [selectedInstanceId, archiveReason, refresh, closeArchiveDialog, detailsDrawerOpen, closeDetails]);

  // Navigate to package generator
  const navigateToPackageGenerator = useCallback((instanceId) => {
    return instanceId;
  }, []);

  // ============================================================
  // RETURN VALUES
  // ============================================================

  return {
    // Data
    instances,
    totalInstances,
    statistics,
    validatedExaminations,
    selectedInstance,
    selectedInstanceId,
    
    // UI State
    isLoading,
    isCreating,
    isLocking,
    isArchiving,
    filters,
    createDialogOpen,
    detailsDrawerOpen,
    archiveDialogOpen,
    archiveReason,
    snackbar,
    
    // Filter Actions
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    
    // Dialog Actions
    openCreateDialog,
    closeCreateDialog,
    openDetails,
    closeDetails,
    openArchiveDialog,
    closeArchiveDialog,
    setArchiveReason,
    
    // Mutation Actions
    handleCreateInstance,
    handleLock,
    handleArchiveConfirm,
    navigateToPackageGenerator,
    
    // Utility
    refresh,
    hideSnackbar,
    showSnackbar,
  };
};

export default useInstances;