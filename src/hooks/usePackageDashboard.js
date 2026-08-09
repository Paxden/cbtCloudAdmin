/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Package Dashboard Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * 
 * Location: src/hooks/usePackageDashboard.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as packageDashboardService from '../services/package/packageDashboardService.js';

/**
 * A generic hook for fetching dashboard data
 */
const useDashboardData = (fetchFn, params = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef(null);
  const fetchCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    // Prevent multiple rapid fetches
    if (fetchCountRef.current > 0 && !options.forceRefresh) {
      return;
    }
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    fetchCountRef.current += 1;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(params);
      if (isMountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError') {
        setError(err);
        setData(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, params, options.forceRefresh]);

  // Effect to trigger data fetching
  useEffect(() => {
    isMountedRef.current = true;
    fetchCountRef.current = 0;
    
    if (options.enabled !== false) {
      const delay = options.delay || 0;
      
      if (delay > 0) {
        timeoutRef.current = setTimeout(fetchData, delay);
      } else {
        fetchData();
      }
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return {
    data,
    loading,
    error,
    refetch: useCallback(() => {
      fetchCountRef.current = 0;
      return fetchData();
    }, [fetchData]),
  };
};

// ============================================================
// EXPORTED HOOKS
// ============================================================

/**
 * Hook: Get dashboard overview
 */
export const useDashboardOverview = (filters = {}, options = {}) => {
  return useDashboardData(
    packageDashboardService.getDashboardOverview,
    filters,
    { ...options, delay: options.delay || 0 }
  );
};

/**
 * Hook: Get status timeline
 */
export const useStatusTimeline = (filters = {}, options = {}) => {
  return useDashboardData(
    packageDashboardService.getStatusTimeline,
    { days: 30, ...filters },
    { ...options, delay: options.delay || 300 }
  );
};

/**
 * Hook: Get performance metrics
 */
export const usePerformanceMetrics = (filters = {}, options = {}) => {
  return useDashboardData(
    packageDashboardService.getPerformanceMetrics,
    filters,
    { ...options, delay: options.delay || 600 }
  );
};

/**
 * Hook: Get centre statistics
 */
export const useCentreStats = (filters = {}, options = {}) => {
  return useDashboardData(
    packageDashboardService.getCentreStats,
    filters,
    { ...options, delay: options.delay || 900 }
  );
};

/**
 * Hook: Get activity feed
 */
export const useActivityFeed = (filters = {}, options = {}) => {
  return useDashboardData(
    packageDashboardService.getActivityFeed,
    { limit: 50, ...filters },
    { ...options, delay: options.delay || 1200 }
  );
};

/**
 * Hook: Get package metrics
 */
export const usePackageMetrics = (filters = {}, options = {}) => {
  return useDashboardData(
    packageDashboardService.getPackageMetrics,
    filters,
    { ...options, delay: options.delay || 1500 }
  );
};

// ============================================================
// COMPATIBILITY HOOKS
// ============================================================

export const useDashboardSummary = (filters = {}, options = {}) => {
  return useDashboardOverview(filters, options);
};

export const useReadyExaminations = (filters = {}, options = {}) => {
  return useActivityFeed({ limit: 20, ...filters }, options);
};

export const useRecentPackages = (filters = {}, options = {}) => {
  return useActivityFeed({ limit: 10, ...filters }, options);
};

export const usePackageStatistics = (filters = {}, options = {}) => {
  return usePerformanceMetrics(filters, options);
};

export const usePackageTimeline = (filters = {}, options = {}) => {
  return useStatusTimeline(filters, options);
};

/**
 * Simple refresh function - just call refetch on each hook
 */
export const useRefreshDashboard = (refetchFunctions = {}) => {
  const refetch = useCallback(async () => {
    const functions = Object.values(refetchFunctions).filter(fn => typeof fn === 'function');
    const results = await Promise.allSettled(functions.map(fn => fn()));
    return results;
  }, [refetchFunctions]);
  
  return refetch;
};

export default {
  useDashboardOverview,
  useStatusTimeline,
  usePerformanceMetrics,
  useCentreStats,
  useActivityFeed,
  usePackageMetrics,
  useDashboardSummary,
  useReadyExaminations,
  useRecentPackages,
  usePackageStatistics,
  usePackageTimeline,
  useRefreshDashboard,
};