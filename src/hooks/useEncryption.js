/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Encryption Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Encryption operations
 * 
 * Location: src/hooks/useEncryption.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as encryptionService from '../services/package/encryptionService.js';

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
 * Hook: Get encryption status with auto-refresh
 */
export const useEncryptionStatus = (packageId, options = {}) => {
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef(null);
  
  // ✅ Validate packageId before enabling
  const isValidPackageId = packageId && packageId !== 'null' && packageId !== null && packageId !== undefined;
  
  const fetchResult = useFetchData(
    encryptionService.getEncryptionStatus,
    packageId,
    { ...options, enabled: isValidPackageId && options.enabled !== false }
  );

  const startPolling = useCallback((interval = 3000) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsPolling(true);
    
    // Initial fetch - only if valid
    if (isValidPackageId) {
      fetchResult.refetch();
    }
    
    // Start polling
    intervalRef.current = setInterval(() => {
      if (isValidPackageId) {
        fetchResult.refetch();
      }
    }, interval);
  }, [fetchResult, isValidPackageId]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    ...fetchResult,
    startPolling,
    stopPolling,
    isPolling,
  };
};

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook: Encrypt a package
 */
export const useEncryptPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const encryptPackage = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await encryptionService.encryptPackage(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { encryptPackage, loading, error, result };
};

/**
 * Hook: Re-encrypt a package (key rotation)
 */
export const useReEncryptPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const reEncryptPackage = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await encryptionService.reEncryptPackage(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reEncryptPackage, loading, error, result };
};

/**
 * Hook: Decrypt a package asset
 */
export const useDecryptAsset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const decryptAsset = useCallback(async (packageId, assetType) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await encryptionService.decryptPackageAsset(packageId, assetType);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { decryptAsset, loading, error, result };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  useEncryptionStatus,
  useEncryptPackage,
  useReEncryptPackage,
  useDecryptAsset,
};