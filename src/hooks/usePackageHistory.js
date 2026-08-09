/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * usePackageHistory Hook
 * Manages package history state with plain React hooks
 * 
 * Location: src/hooks/usePackageHistory.js
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as packageHistoryService from '../services/package/packageHistoryService';

/**
 * Main hook for managing package history
 */
export const usePackageHistory = () => {
  // ============================================================
  // STATE
  // ============================================================

  // Data states
  const [history, setHistory] = useState([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [lifecycle, setLifecycle] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [loadingLifecycle, setLoadingLifecycle] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState(null);

  // Dialog states
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [lifecycleDialogOpen, setLifecycleDialogOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    activityType: '',
    severity: '',
    userId: '',
    centreId: '',
    packageId: '',
    examId: '',
    instanceId: '',
    startDate: '',
    endDate: '',
    status: '',
    sort: '-timestamp'
  });

  // Abort controller ref
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // ============================================================
  // DATA FETCHING FUNCTIONS
  // ============================================================

  /**
   * Fetch history with current filters
   */
  const fetchHistory = useCallback(async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await packageHistoryService.getHistory(filters, abortSignal);
      
      if (!isMountedRef.current) return;
      
      setHistory(response.data || []);
      setTotalHistory(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      setError(err.message || 'Failed to fetch history');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters]);

  /**
   * Fetch history statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStatistics(true);
      const data = await packageHistoryService.getHistoryStatistics({
        centreId: filters.centreId,
        examId: filters.examId,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      if (isMountedRef.current) {
        setStatistics(data);
      }
    } catch (err) {
      console.warn('Failed to fetch statistics:', err.message);
      if (isMountedRef.current) {
        setStatistics({
          totalActivities: 0,
          packagesCreated: 0,
          packagesGenerated: 0,
          packagesDistributed: 0,
          packagesDownloaded: 0,
          failedActivities: 0,
          auditEvents: 0
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingStatistics(false);
      }
    }
  }, [filters.centreId, filters.examId, filters.startDate, filters.endDate]);

  /**
   * Fetch history details
   */
  const fetchHistoryDetails = useCallback(async (historyId) => {
    if (!historyId) return null;

    try {
      setLoadingDetails(true);
      const data = await packageHistoryService.getHistoryDetails(historyId);
      if (isMountedRef.current) {
        setSelectedHistory(data);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch history details');
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoadingDetails(false);
      }
    }
  }, []);

  /**
   * Fetch package timeline
   */
  const fetchTimeline = useCallback(async (packageId) => {
    if (!packageId) return;

    try {
      setLoadingTimeline(true);
      const data = await packageHistoryService.getTimeline(packageId);
      if (isMountedRef.current) {
        setTimeline(data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch timeline');
    } finally {
      if (isMountedRef.current) {
        setLoadingTimeline(false);
      }
    }
  }, []);

  /**
   * Fetch package lifecycle
   */
  const fetchLifecycle = useCallback(async (packageId) => {
    if (!packageId) return;

    try {
      setLoadingLifecycle(true);
      const data = await packageHistoryService.getPackageLifecycle(packageId);
      if (isMountedRef.current) {
        setLifecycle(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch lifecycle');
    } finally {
      if (isMountedRef.current) {
        setLoadingLifecycle(false);
      }
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
    fetchHistory(abortControllerRef.current.signal);
    fetchStatistics();
  }, [fetchHistory, fetchStatistics]);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Fetch history when filters change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    fetchHistory(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, fetchHistory]);

  // Fetch statistics on mount and filter changes
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Fetch details when selected
  useEffect(() => {
    if (selectedHistoryId && detailsDrawerOpen) {
      fetchHistoryDetails(selectedHistoryId);
    }
  }, [selectedHistoryId, detailsDrawerOpen, fetchHistoryDetails]);

  // Fetch timeline when dialog opens
  useEffect(() => {
    if (selectedPackageId && timelineDialogOpen) {
      fetchTimeline(selectedPackageId);
    }
  }, [selectedPackageId, timelineDialogOpen, fetchTimeline]);

  // Fetch lifecycle when dialog opens
  useEffect(() => {
    if (selectedPackageId && lifecycleDialogOpen) {
      fetchLifecycle(selectedPackageId);
    }
  }, [selectedPackageId, lifecycleDialogOpen, fetchLifecycle]);

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
      activityType: '',
      severity: '',
      userId: '',
      centreId: '',
      packageId: '',
      examId: '',
      instanceId: '',
      startDate: '',
      endDate: '',
      status: '',
      sort: '-timestamp'
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
   * Open history details
   */
  const openDetails = useCallback((historyId) => {
    setSelectedHistoryId(historyId);
    setDetailsDrawerOpen(true);
  }, []);

  /**
   * Close history details
   */
  const closeDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setTimeout(() => {
      setSelectedHistoryId(null);
      setSelectedHistory(null);
    }, 300);
  }, []);

  /**
   * Open timeline dialog
   */
  const openTimeline = useCallback((packageId) => {
    setSelectedPackageId(packageId);
    setTimelineDialogOpen(true);
  }, []);

  /**
   * Close timeline dialog
   */
  const closeTimeline = useCallback(() => {
    setTimelineDialogOpen(false);
    setTimeline([]);
    setSelectedPackageId(null);
  }, []);

  /**
   * Open lifecycle dialog
   */
  const openLifecycle = useCallback((packageId) => {
    setSelectedPackageId(packageId);
    setLifecycleDialogOpen(true);
  }, []);

  /**
   * Close lifecycle dialog
   */
  const closeLifecycle = useCallback(() => {
    setLifecycleDialogOpen(false);
    setLifecycle(null);
    setSelectedPackageId(null);
  }, []);

  /**
   * Export audit report
   */
  const exportReport = useCallback(async (format = 'pdf') => {
    try {
      setExporting(true);
      const blob = await packageHistoryService.exportAuditReport({
        centreId: filters.centreId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        format
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to export report');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setExporting(false);
      }
    }
  }, [filters.centreId, filters.startDate, filters.endDate]);

  /**
   * Print audit report
   */
  const printReport = useCallback(async () => {
    try {
      setPrinting(true);
      const blob = await packageHistoryService.printAuditReport({
        centreId: filters.centreId,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.print();
      }
    } catch (err) {
      setError(err.message || 'Failed to print report');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setPrinting(false);
      }
    }
  }, [filters.centreId, filters.startDate, filters.endDate]);

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
    history,
    totalHistory,
    totalPages,
    selectedHistory,
    statistics,
    timeline,
    lifecycle,
    
    // State
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    loadingTimeline,
    loadingLifecycle,
    exporting,
    printing,
    isError,
    error,
    
    // Dialog states
    detailsDrawerOpen,
    timelineDialogOpen,
    lifecycleDialogOpen,
    selectedHistoryId,
    selectedPackageId,
    
    // Handlers
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openTimeline,
    closeTimeline,
    openLifecycle,
    closeLifecycle,
    exportReport,
    printReport,
    
    // Refresh
    refresh,
    
    // Fetch functions
    fetchHistoryDetails,
    fetchTimeline,
    fetchLifecycle
  };
};

export default usePackageHistory;