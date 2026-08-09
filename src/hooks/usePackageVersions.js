/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * usePackageVersions Hook
 * Manages package versions state with plain React hooks
 * 
 * Location: src/hooks/usePackageVersions.js
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as packageVersionService from '../services/package/packageVersionService';

/**
 * Main hook for managing package versions
 */
export const usePackageVersions = () => {
  // ============================================================
  // STATE
  // ============================================================

  // Data states
  const [versions, setVersions] = useState([]);
  const [totalVersions, setTotalVersions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  // Dialog states
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [compareVersionAId, setCompareVersionAId] = useState(null);
  const [compareVersionBId, setCompareVersionBId] = useState(null);
  const [archiveReason, setArchiveReason] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    centreId: '',
    examId: '',
    packageId: '',
    versionNumber: '',
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
   * Fetch versions with current filters
   */
  const fetchVersions = useCallback(async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await packageVersionService.getVersions(filters, abortSignal);
      
      if (!isMountedRef.current) return;
      
      setVersions(response.data || []);
      setTotalVersions(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      setError(err.message || 'Failed to fetch versions');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters]);

  /**
   * Fetch version statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStatistics(true);
      const data = await packageVersionService.getVersionStatistics({
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
          latest: 0,
          archived: 0,
          regenerated: 0,
          active: 0,
          revoked: 0
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingStatistics(false);
      }
    }
  }, [filters.centreId, filters.examId]);

  /**
   * Fetch version details
   */
  const fetchVersionDetails = useCallback(async (versionId) => {
    if (!versionId) return null;

    try {
      setLoadingDetails(true);
      const data = await packageVersionService.getVersion(versionId);
      if (isMountedRef.current) {
        setSelectedVersion(data);
        return data;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch version details');
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoadingDetails(false);
      }
    }
  }, []);

  /**
   * Fetch version timeline
   */
  const fetchTimeline = useCallback(async (versionId) => {
    if (!versionId) return;

    try {
      setLoadingTimeline(true);
      const data = await packageVersionService.getVersionTimeline(versionId);
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
   * Compare versions
   */
  const compareVersions = useCallback(async (versionAId, versionBId) => {
    if (!versionAId || !versionBId) return;

    try {
      setComparing(true);
      const data = await packageVersionService.compareVersions(versionAId, versionBId);
      if (isMountedRef.current) {
        setComparisonResult(data);
        setComparisonDialogOpen(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to compare versions');
    } finally {
      if (isMountedRef.current) {
        setComparing(false);
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
    fetchVersions(abortControllerRef.current.signal);
    fetchStatistics();
  }, [fetchVersions, fetchStatistics]);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Fetch versions when filters change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    fetchVersions(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, fetchVersions]);

  // Fetch statistics on mount and filter changes
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Fetch details when selected
  useEffect(() => {
    if (selectedVersionId && detailsDrawerOpen) {
      fetchVersionDetails(selectedVersionId);
    }
  }, [selectedVersionId, detailsDrawerOpen, fetchVersionDetails]);

  // Fetch timeline when dialog opens
  useEffect(() => {
    if (selectedVersionId && timelineDialogOpen) {
      fetchTimeline(selectedVersionId);
    }
  }, [selectedVersionId, timelineDialogOpen, fetchTimeline]);

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
      packageId: '',
      versionNumber: '',
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
   * Open version details
   */
  const openDetails = useCallback((versionId) => {
    setSelectedVersionId(versionId);
    setDetailsDrawerOpen(true);
  }, []);

  /**
   * Close version details
   */
  const closeDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setTimeout(() => {
      setSelectedVersionId(null);
      setSelectedVersion(null);
    }, 300);
  }, []);

  /**
   * Open timeline dialog
   */
  const openTimeline = useCallback((versionId) => {
    setSelectedVersionId(versionId);
    setTimelineDialogOpen(true);
  }, []);

  /**
   * Close timeline dialog
   */
  const closeTimeline = useCallback(() => {
    setTimelineDialogOpen(false);
    setTimeline([]);
    setSelectedVersionId(null);
  }, []);

  /**
   * Open comparison dialog
   */
  const openComparison = useCallback((versionAId, versionBId) => {
    setCompareVersionAId(versionAId);
    setCompareVersionBId(versionBId);
    compareVersions(versionAId, versionBId);
  }, [compareVersions]);

  /**
   * Close comparison dialog
   */
  const closeComparison = useCallback(() => {
    setComparisonDialogOpen(false);
    setComparisonResult(null);
    setCompareVersionAId(null);
    setCompareVersionBId(null);
  }, []);

  /**
   * Open regenerate dialog
   */
  const openRegenerate = useCallback((versionId) => {
    setSelectedVersionId(versionId);
    setRegenerateDialogOpen(true);
  }, []);

  /**
   * Close regenerate dialog
   */
  const closeRegenerate = useCallback(() => {
    setRegenerateDialogOpen(false);
    setSelectedVersionId(null);
  }, []);

  /**
   * Open archive dialog
   */
  const openArchive = useCallback((versionId) => {
    setSelectedVersionId(versionId);
    setArchiveDialogOpen(true);
  }, []);

  /**
   * Close archive dialog
   */
  const closeArchive = useCallback(() => {
    setArchiveDialogOpen(false);
    setArchiveReason('');
    setSelectedVersionId(null);
  }, []);

  /**
   * Regenerate package
   */
  const handleRegenerate = useCallback(async (options) => {
    if (!selectedVersionId) return;

    try {
      setRegenerating(true);
      const result = await packageVersionService.regeneratePackage(selectedVersionId, options);
      if (isMountedRef.current) {
        refresh();
        closeRegenerate();
        return result;
      }
    } catch (err) {
      setError(err.message || 'Failed to regenerate package');
      throw err;
    } finally {
      if (isMountedRef.current) {
        setRegenerating(false);
      }
    }
  }, [selectedVersionId, refresh, closeRegenerate]);

  /**
   * Archive version
   */
  const handleArchive = useCallback(async () => {
    if (!selectedVersionId) return;

    try {
      const result = await packageVersionService.archiveVersion(selectedVersionId, archiveReason);
      if (isMountedRef.current) {
        refresh();
        closeArchive();
        if (detailsDrawerOpen) {
          closeDetails();
        }
        return result;
      }
    } catch (err) {
      setError(err.message || 'Failed to archive version');
      throw err;
    }
  }, [selectedVersionId, archiveReason, refresh, closeArchive, detailsDrawerOpen, closeDetails]);

  /**
   * Export version report
   */
  const exportReport = useCallback(async (format = 'csv') => {
    try {
      const blob = await packageVersionService.exportVersionReport({
        centreId: filters.centreId,
        format
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `version-report-${new Date().toISOString().split('T')[0]}.${format}`;
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
    versions,
    totalVersions,
    totalPages,
    selectedVersion,
    statistics,
    timeline,
    comparisonResult,
    
    // State
    filters,
    isLoading,
    loadingDetails,
    loadingStatistics,
    loadingTimeline,
    comparing,
    regenerating,
    isError,
    error,
    
    // Dialog states
    detailsDrawerOpen,
    comparisonDialogOpen,
    regenerateDialogOpen,
    timelineDialogOpen,
    archiveDialogOpen,
    selectedVersionId,
    compareVersionAId,
    compareVersionBId,
    archiveReason,
    
    // Handlers
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openTimeline,
    closeTimeline,
    openComparison,
    closeComparison,
    openRegenerate,
    closeRegenerate,
    openArchive,
    closeArchive,
    handleRegenerate,
    handleArchive,
    exportReport,
    setArchiveReason,
    
    // Refresh
    refresh,
    
    // Fetch functions
    fetchVersionDetails,
    fetchTimeline,
    compareVersions
  };
};

export default usePackageVersions;