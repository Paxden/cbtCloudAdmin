/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Checksum Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Checksum operations
 * 
 * Location: src/hooks/useChecksum.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as checksumService from '../services/package/checksumService.js';

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
    // ✅ Skip if params is null or undefined or 'null'
    if (!params || params === 'null') {
      setLoading(false);
      return;
    }
    
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
    
    // ✅ Only fetch if enabled and params is valid
    const isValidParams = params && params !== 'null';
    if (options.enabled !== false && isValidParams) {
      fetchData();
    }
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, options.enabled, params]);

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
 * Hook: Get checksum information
 */
export const useChecksum = (packageId, options = {}) => {
  // ✅ Validate packageId before enabling
  const isValidPackageId = packageId && packageId !== 'null' && packageId !== null && packageId !== undefined;
  
  return useFetchData(
    checksumService.getChecksum,
    packageId,
    { ...options, enabled: isValidPackageId && options.enabled !== false }
  );
};

/**
 * Hook: Get package fingerprint
 */
export const useFingerprint = (packageId, options = {}) => {
  const isValidPackageId = packageId && packageId !== 'null' && packageId !== null && packageId !== undefined;
  
  return useFetchData(
    checksumService.getFingerprint,
    packageId,
    { ...options, enabled: isValidPackageId && options.enabled !== false }
  );
};

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook: Generate checksum for a package
 */
export const useGenerateChecksum = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generateChecksum = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await checksumService.generateChecksum(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateChecksum, loading, error, result };
};

/**
 * Hook: Verify package integrity
 */
export const useVerifyChecksum = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const verifyChecksum = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await checksumService.verifyChecksum(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { verifyChecksum, loading, error, result };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  useChecksum,
  useFingerprint,
  useGenerateChecksum,
  useVerifyChecksum,
};