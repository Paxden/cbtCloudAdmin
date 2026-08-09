/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * usePackageValidation Hook
 * Manages package validation state with plain React hooks
 * 
 * Location: src/hooks/packageValidation/usePackageValidation.js
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as packageValidationService from '../services/package/packageValidationService';

/**
 * Main hook for managing package validation
 */
export const usePackageValidation = () => {
  // ============================================================
  // STATE
  // ============================================================

  // Data states
  const [validations, setValidations] = useState([]);
  const [totalValidations, setTotalValidations] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [readyPackages, setReadyPackages] = useState([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [runningValidation, setRunningValidation] = useState(false);
  const [error, setError] = useState(null);

  // Dialog states
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [selectedValidationId, setSelectedValidationId] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    centreId: '',
    examId: '',
    instanceId: '',
    startDate: '',
    endDate: '',
    sort: '-createdAt'
  });

  // Abort controller ref
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // ============================================================
  // DATA FETCHING FUNCTIONS
  // ============================================================

  /**
   * Fetch validations with current filters
   */
  const fetchValidations = useCallback(async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await packageValidationService.getValidations(filters, abortSignal);
      
      if (!isMountedRef.current) return;
      
      setValidations(response.data || []);
      setTotalValidations(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      setError(err.message || 'Failed to fetch validations');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters]);

  /**
   * Fetch validation statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStatistics(true);
      const data = await packageValidationService.getValidationStatistics({
        centreId: filters.centreId,
        examId: filters.examId,
        instanceId: filters.instanceId
      });
      if (isMountedRef.current) {
        setStatistics(data);
      }
    } catch (err) {
      console.warn('Failed to fetch statistics:', err.message);
      if (isMountedRef.current) {
        setStatistics({
          total: 0,
          valid: 0,
          pending: 0,
          failed: 0,
          warning: 0,
          rejected: 0,
          readyForDistribution: 0
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingStatistics(false);
      }
    }
  }, [filters.centreId, filters.examId, filters.instanceId]);

  /**
   * Fetch validation details
   */
  const fetchValidationDetails = useCallback(async (validationId) => {
    if (!validationId) return null;

    try {
      setLoadingDetails(true);
      const data = await packageValidationService.getValidation(validationId);
      if (isMountedRef.current) {
        setSelectedValidation(data);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch validation details');
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoadingDetails(false);
      }
    }
  }, []);

  /**
   * Fetch validation checklist
   */
  const fetchChecklist = useCallback(async (validationId) => {
    if (!validationId) return;

    try {
      const data = await packageValidationService.getValidationChecklist(validationId);
      if (isMountedRef.current) {
        setChecklist(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch checklist');
    }
  }, []);

  /**
   * Fetch packages ready for validation
   */
  const fetchReadyPackages = useCallback(async () => {
    try {
      const data = await packageValidationService.getReadyPackages({
        centreId: filters.centreId
      });
      if (isMountedRef.current) {
        setReadyPackages(data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch ready packages:', err.message);
    }
  }, [filters.centreId]);

  /**
   * Refresh all data
   */
  const refresh = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    fetchValidations(abortControllerRef.current.signal);
    fetchStatistics();
    fetchReadyPackages();
  }, [fetchValidations, fetchStatistics, fetchReadyPackages]);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Fetch validations when filters change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    fetchValidations(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, fetchValidations]);

  // Fetch statistics on mount and filter changes
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Fetch ready packages on mount
  useEffect(() => {
    fetchReadyPackages();
  }, [fetchReadyPackages]);

  // Fetch details when selected
  useEffect(() => {
    if (selectedValidationId && detailsDrawerOpen) {
      fetchValidationDetails(selectedValidationId);
    }
  }, [selectedValidationId, detailsDrawerOpen, fetchValidationDetails]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ============================================================
  // HANDLERS
  // ============================================================

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }));
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      search: '',
      status: '',
      centreId: '',
      examId: '',
      instanceId: '',
      startDate: '',
      endDate: '',
      sort: '-createdAt'
    });
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((event, newPage) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  }, []);

  /**
   * Handle rows per page change
   */
  const handleRowsPerPageChange = useCallback((event) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1
    }));
  }, []);

  /**
   * Open validation details
   */
  const openDetails = useCallback((validationId) => {
    setSelectedValidationId(validationId);
    setDetailsDrawerOpen(true);
  }, []);

  /**
   * Close validation details
   */
  const closeDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setTimeout(() => {
      setSelectedValidationId(null);
      setSelectedValidation(null);
    }, 300);
  }, []);

  /**
   * Open checklist dialog
   */
  const openChecklist = useCallback(async (validationId) => {
    setSelectedValidationId(validationId);
    await fetchChecklist(validationId);
    setChecklistDialogOpen(true);
  }, [fetchChecklist]);

  /**
   * Close checklist dialog
   */
  const closeChecklist = useCallback(() => {
    setChecklistDialogOpen(false);
    setChecklist(null);
  }, []);

  /**
   * Run validation
   */
  const runValidation = useCallback(async (packageId, options = {}) => {
    try {
      setRunningValidation(true);
      setError(null);
      
      const result = await packageValidationService.runValidation(packageId, options);
      
      if (isMountedRef.current) {
        setValidationResult(result);
        setResultDialogOpen(true);
        // Refresh data
        refresh();
        return result;
      }
    } catch (err) {
      setError(err.message || 'Failed to run validation');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setRunningValidation(false);
      }
    }
  }, [refresh]);

  /**
   * Run batch validation
   */
  const runBatchValidation = useCallback(async (packageIds, options = {}) => {
    try {
      setRunningValidation(true);
      setError(null);
      
      const result = await packageValidationService.runBatchValidation(packageIds, options);
      
      if (isMountedRef.current) {
        setValidationResult(result);
        setResultDialogOpen(true);
        refresh();
        return result;
      }
    } catch (err) {
      setError(err.message || 'Failed to run batch validation');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setRunningValidation(false);
      }
    }
  }, [refresh]);

  /**
   * Export validation report
   */
  const exportReport = useCallback(async (validationId, format = 'pdf') => {
    try {
      const blob = await packageValidationService.exportValidationReport(validationId, format);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `validation-report-${validationId}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to export report');
      throw err;
    }
  }, []);

  /**
   * Close result dialog
   */
  const closeResult = useCallback(() => {
    setResultDialogOpen(false);
    setValidationResult(null);
  }, []);

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const isLoading = useMemo(() => loading, [loading]);
  const isFetching = useMemo(() => loading, [loading]);
  const isError = useMemo(() => !!error, [error]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // Data
    validations,
    totalValidations,
    totalPages,
    selectedValidation,
    checklist,
    statistics,
    readyPackages,
    validationResult,
    
    // State
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    runningValidation,
    isError,
    error,
    
    // Dialog states
    detailsDrawerOpen,
    checklistDialogOpen,
    resultDialogOpen,
    selectedValidationId,
    
    // Handlers
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
    
    // Refresh
    refresh,
    
    // Fetch functions
    fetchValidationDetails,
    fetchChecklist,
    fetchReadyPackages
  };
};

export default usePackageValidation;