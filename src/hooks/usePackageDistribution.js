/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * usePackageDistribution Hook
 * Manages package distribution state with plain React hooks
 * 
 * Location: src/hooks/usePackageDistribution.js
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as packageDistributionService from '../services/package/packageDistributionService';

/**
 * Main hook for managing package distribution
 */
export const usePackageDistribution = () => {
  // ============================================================
  // STATE
  // ============================================================

  // Data states
  const [distributions, setDistributions] = useState([]);
  const [totalDistributions, setTotalDistributions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [validatedPackages, setValidatedPackages] = useState([]);
  const [centreDeliveryStatus, setCentreDeliveryStatus] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState(null);

  // Dialog states
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [centreStatusDialogOpen, setCentreStatusDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedDistributionId, setSelectedDistributionId] = useState(null);
  const [selectedCentreId, setSelectedCentreId] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');

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
   * Fetch distributions with current filters
   */
  const fetchDistributions = useCallback(async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await packageDistributionService.getDistributions(filters, abortSignal);
      
      if (!isMountedRef.current) return;
      
      setDistributions(response.data || []);
      setTotalDistributions(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      setError(err.message || 'Failed to fetch distributions');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters]);

  /**
   * Fetch distribution statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStatistics(true);
      const data = await packageDistributionService.getDistributionStatistics({
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
          validated: 0,
          ready: 0,
          released: 0,
          delivered: 0,
          pendingDelivery: 0,
          failedDelivery: 0
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingStatistics(false);
      }
    }
  }, [filters.centreId, filters.examId, filters.instanceId]);

  /**
   * Fetch distribution details
   */
  const fetchDistributionDetails = useCallback(async (distributionId) => {
    if (!distributionId) return null;

    try {
      setLoadingDetails(true);
      const data = await packageDistributionService.getDistribution(distributionId);
      if (isMountedRef.current) {
        setSelectedDistribution(data);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch distribution details');
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoadingDetails(false);
      }
    }
  }, []);

  /**
   * Fetch validated packages
   */
  const fetchValidatedPackages = useCallback(async () => {
    try {
      const data = await packageDistributionService.getValidatedPackages({
        centreId: filters.centreId
      });
      if (isMountedRef.current) {
        setValidatedPackages(data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch validated packages:', err.message);
    }
  }, [filters.centreId]);

  /**
   * Fetch centre delivery status
   */
  const fetchCentreDeliveryStatus = useCallback(async (centreId) => {
    if (!centreId) return;

    try {
      const data = await packageDistributionService.getCentreDeliveryStatus(centreId);
      if (isMountedRef.current) {
        setCentreDeliveryStatus(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch centre delivery status');
    }
  }, []);

  /**
   * Refresh all data
   */
  const refresh = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    fetchDistributions(abortControllerRef.current.signal);
    fetchStatistics();
    fetchValidatedPackages();
  }, [fetchDistributions, fetchStatistics, fetchValidatedPackages]);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Fetch distributions when filters change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    fetchDistributions(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, fetchDistributions]);

  // Fetch statistics on mount and filter changes
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Fetch validated packages on mount
  useEffect(() => {
    fetchValidatedPackages();
  }, [fetchValidatedPackages]);

  // Fetch details when selected
  useEffect(() => {
    if (selectedDistributionId && detailsDrawerOpen) {
      fetchDistributionDetails(selectedDistributionId);
    }
  }, [selectedDistributionId, detailsDrawerOpen, fetchDistributionDetails]);

  // Fetch centre status when dialog opens
  useEffect(() => {
    if (selectedCentreId && centreStatusDialogOpen) {
      fetchCentreDeliveryStatus(selectedCentreId);
    }
  }, [selectedCentreId, centreStatusDialogOpen, fetchCentreDeliveryStatus]);

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
   * Open distribution details
   */
  const openDetails = useCallback((distributionId) => {
    setSelectedDistributionId(distributionId);
    setDetailsDrawerOpen(true);
  }, []);

  /**
   * Close distribution details
   */
  const closeDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setTimeout(() => {
      setSelectedDistributionId(null);
      setSelectedDistribution(null);
    }, 300);
  }, []);

  /**
   * Open release dialog
   */
  const openReleaseDialog = useCallback(() => {
    setReleaseDialogOpen(true);
  }, []);

  /**
   * Close release dialog
   */
  const closeReleaseDialog = useCallback(() => {
    setReleaseDialogOpen(false);
  }, []);

  /**
   * Open centre status dialog
   */
  const openCentreStatus = useCallback((centreId) => {
    setSelectedCentreId(centreId);
    setCentreStatusDialogOpen(true);
  }, []);

  /**
   * Close centre status dialog
   */
  const closeCentreStatus = useCallback(() => {
    setCentreStatusDialogOpen(false);
    setCentreDeliveryStatus(null);
    setSelectedCentreId(null);
  }, []);

  /**
   * Open revoke dialog
   */
  const openRevokeDialog = useCallback((distributionId) => {
    setSelectedDistributionId(distributionId);
    setRevokeDialogOpen(true);
  }, []);

  /**
   * Close revoke dialog
   */
  const closeRevokeDialog = useCallback(() => {
    setRevokeDialogOpen(false);
    setRevokeReason('');
    setSelectedDistributionId(null);
  }, []);

  /**
   * Release a package
   */
  const releasePackage = useCallback(async (packageId, options = {}) => {
    try {
      setReleasing(true);
      setError(null);
      
      const result = await packageDistributionService.releasePackage(packageId, options);
      
      if (isMountedRef.current) {
        // Refresh data
        refresh();
        return result;
      }
    } catch (err) {
      setError(err.message || 'Failed to release package');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setReleasing(false);
      }
    }
  }, [refresh]);

  /**
   * Release multiple packages
   */
  const releaseBatchPackages = useCallback(async (packageIds, options = {}) => {
    try {
      setReleasing(true);
      setError(null);
      
      const result = await packageDistributionService.releaseBatchPackages(packageIds, options);
      
      if (isMountedRef.current) {
        refresh();
        return result;
      }
    } catch (err) {
      setError(err.message || 'Failed to release packages');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setReleasing(false);
      }
    }
  }, [refresh]);

  /**
   * Revoke a distribution
   */
  const revokeDistribution = useCallback(async (distributionId, reason = '') => {
    try {
      setRevoking(true);
      setError(null);
      
      const result = await packageDistributionService.revokeDistribution(distributionId, reason);
      
      if (isMountedRef.current) {
        refresh();
        if (detailsDrawerOpen) {
          closeDetails();
        }
        closeRevokeDialog();
        return result;
      }
    } catch (err) {
      setError(err.message || 'Failed to revoke distribution');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setRevoking(false);
      }
    }
  }, [refresh, detailsDrawerOpen, closeDetails, closeRevokeDialog]);

  /**
   * Export distribution report
   */
  const exportReport = useCallback(async (format = 'pdf') => {
    try {
      const blob = await packageDistributionService.exportDistributionReport({
        centreId: filters.centreId,
        format
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `distribution-report-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to export report');
      throw err;
    }
  }, [filters.centreId]);

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
    distributions,
    totalDistributions,
    totalPages,
    selectedDistribution,
    validatedPackages,
    centreDeliveryStatus,
    statistics,
    
    // State
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    releasing,
    revoking,
    isError,
    error,
    
    // Dialog states
    detailsDrawerOpen,
    releaseDialogOpen,
    centreStatusDialogOpen,
    revokeDialogOpen,
    selectedDistributionId,
    selectedCentreId,
    revokeReason,
    
    // Handlers
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openReleaseDialog,
    closeReleaseDialog,
    openCentreStatus,
    closeCentreStatus,
    openRevokeDialog,
    closeRevokeDialog,
    releasePackage,
    releaseBatchPackages,
    revokeDistribution,
    exportReport,
    setRevokeReason,
    
    // Refresh
    refresh,
    
    // Fetch functions
    fetchDistributionDetails,
    fetchValidatedPackages,
    fetchCentreDeliveryStatus
  };
};

export default usePackageDistribution;