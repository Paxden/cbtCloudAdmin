
/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Distribution Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Distribution operations
 * 
 * Location: src/hooks/useDistribution.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as distributionService from '../services/package/distributionService.js';

/**
 * Generic hook for fetching data
 */
const useFetchData = (fetchFn, params = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
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
  }, [fetchFn, params]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (options.enabled !== false) {
      fetchData();
    }
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, options.enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// ============================================================
// QUERY HOOKS
// ============================================================

/**
 * Hook: Get all distributions with filters
 */
export const useDistributions = (params = {}, options = {}) => {
  return useFetchData(
    distributionService.getAllDistributions,
    params,
    options
  );
};

/**
 * Hook: Get distributions for a centre
 */
export const useCentreDistributions = (centreId, params = {}, options = {}) => {
  return useFetchData(
    distributionService.getCentreDistributions,
    { centreId, ...params },
    { ...options, enabled: !!centreId && options.enabled !== false }
  );
};

/**
 * Hook: Get distribution by ID
 */
export const useDistribution = (distributionId, options = {}) => {
  return useFetchData(
    distributionService.getDistribution,
    distributionId,
    { ...options, enabled: !!distributionId && options.enabled !== false }
  );
};

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook: Create a distribution
 */
export const useCreateDistribution = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const createDistribution = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await distributionService.createDistribution(data);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createDistribution, loading, error, result };
};

/**
 * Hook: Authorize download
 */
export const useAuthorizeDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const authorizeDownload = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await distributionService.authorizeDownload(data);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { authorizeDownload, loading, error, result };
};

/**
 * Hook: Revoke a distribution
 */
export const useRevokeDistribution = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const revokeDistribution = useCallback(async (distributionId, reason = '') => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await distributionService.revokeDistribution(distributionId, reason);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { revokeDistribution, loading, error, result };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  useDistributions,
  useCentreDistributions,
  useDistribution,
  useCreateDistribution,
  useAuthorizeDownload,
  useRevokeDistribution,
};