/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * usePackageDownloads Hook
 * Manages package downloads state with plain React hooks
 * 
 * Location: src/hooks/usePackageDownloads.js
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as packageDownloadService from '../services/package/packageDownloadService.';

/**
 * Main hook for managing package downloads
 */
export const usePackageDownloads = () => {
  // ============================================================
  // STATE
  // ============================================================

  // Data states
  const [downloads, setDownloads] = useState([]);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDownload, setSelectedDownload] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [packageDownloads, setPackageDownloads] = useState([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  // Dialog states
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [selectedDownloadId, setSelectedDownloadId] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    centreId: '',
    packageId: '',
    examId: '',
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
   * Fetch downloads with current filters
   */
  const fetchDownloads = useCallback(async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await packageDownloadService.getDownloads(filters, abortSignal);
      
      if (!isMountedRef.current) return;
      
      setDownloads(response.data || []);
      setTotalDownloads(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      setError(err.message || 'Failed to fetch downloads');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters]);

  /**
   * Fetch download statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStatistics(true);
      const data = await packageDownloadService.getDownloadStatistics({
        centreId: filters.centreId,
        examId: filters.examId
      });
      if (isMountedRef.current) {
        setStatistics(data);
      }
    } catch (err) {
      console.warn('Failed to fetch statistics:', err.message);
      if (isMountedRef.current) {
        setStatistics({
          total: 0,
          successful: 0,
          failed: 0,
          pending: 0,
          uniqueCentres: 0,
          latestDownload: null
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingStatistics(false);
      }
    }
  }, [filters.centreId, filters.examId]);

  /**
   * Fetch download details
   */
  const fetchDownloadDetails = useCallback(async (downloadId) => {
    if (!downloadId) return null;

    try {
      setLoadingDetails(true);
      const data = await packageDownloadService.getDownload(downloadId);
      if (isMountedRef.current) {
        setSelectedDownload(data);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch download details');
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoadingDetails(false);
      }
    }
  }, []);

  /**
   * Fetch download timeline
   */
  const fetchTimeline = useCallback(async (downloadId) => {
    if (!downloadId) return;

    try {
      setLoadingTimeline(true);
      const data = await packageDownloadService.getDownloadTimeline(downloadId);
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
   * Fetch package downloads
   */
  const fetchPackageDownloads = useCallback(async (packageId) => {
    if (!packageId) return;

    try {
      const data = await packageDownloadService.getPackageDownloads(packageId);
      if (isMountedRef.current) {
        setPackageDownloads(data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch package downloads:', err.message);
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
    fetchDownloads(abortControllerRef.current.signal);
    fetchStatistics();
  }, [fetchDownloads, fetchStatistics]);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Fetch downloads when filters change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    fetchDownloads(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, fetchDownloads]);

  // Fetch statistics on mount and filter changes
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Fetch details when selected
  useEffect(() => {
    if (selectedDownloadId && detailsDrawerOpen) {
      fetchDownloadDetails(selectedDownloadId);
    }
  }, [selectedDownloadId, detailsDrawerOpen, fetchDownloadDetails]);

  // Fetch timeline when dialog opens
  useEffect(() => {
    if (selectedDownloadId && timelineDialogOpen) {
      fetchTimeline(selectedDownloadId);
    }
  }, [selectedDownloadId, timelineDialogOpen, fetchTimeline]);

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
      packageId: '',
      examId: '',
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
   * Open download details
   */
  const openDetails = useCallback((downloadId) => {
    setSelectedDownloadId(downloadId);
    setDetailsDrawerOpen(true);
  }, []);

  /**
   * Close download details
   */
  const closeDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setTimeout(() => {
      setSelectedDownloadId(null);
      setSelectedDownload(null);
    }, 300);
  }, []);

  /**
   * Open timeline dialog
   */
  const openTimeline = useCallback((downloadId) => {
    setSelectedDownloadId(downloadId);
    setTimelineDialogOpen(true);
  }, []);

  /**
   * Close timeline dialog
   */
  const closeTimeline = useCallback(() => {
    setTimelineDialogOpen(false);
    setTimeline([]);
    setSelectedDownloadId(null);
  }, []);

  /**
   * Export download report
   */
  const exportReport = useCallback(async (format = 'csv') => {
    try {
      setExporting(true);
      const blob = await packageDownloadService.exportDownloadReport({
        centreId: filters.centreId,
        format,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `download-report-${new Date().toISOString().split('T')[0]}.${format}`;
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
   * Retry download
   */
  const retryDownload = useCallback(async (downloadId) => {
    try {
      const result = await packageDownloadService.retryDownload(downloadId);
      refresh();
      return result;
    } catch (err) {
      setError(err.message || 'Failed to retry download');
      throw err;
    }
  }, [refresh]);

  /**
   * Verify download
   */
  const verifyDownload = useCallback(async (downloadId) => {
    try {
      const result = await packageDownloadService.verifyDownload(downloadId);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to verify download');
      throw err;
    }
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
    downloads,
    totalDownloads,
    totalPages,
    selectedDownload,
    statistics,
    timeline,
    packageDownloads,
    
    // State
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    loadingTimeline,
    exporting,
    isError,
    error,
    
    // Dialog states
    detailsDrawerOpen,
    timelineDialogOpen,
    selectedDownloadId,
    
    // Handlers
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openTimeline,
    closeTimeline,
    exportReport,
    retryDownload,
    verifyDownload,
    
    // Refresh
    refresh,
    
    // Fetch functions
    fetchDownloadDetails,
    fetchTimeline,
    fetchPackageDownloads
  };
};

export default usePackageDownloads;