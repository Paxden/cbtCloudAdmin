/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */

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
 * Hook: Get encryption status with auto-refresh
 */
export const useEncryptionStatus = (packageId, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const intervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    if (!packageId) {
      setData(null);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await encryptionService.getEncryptionStatus(packageId);
      if (isMountedRef.current) {
        setData(response);
        setError(null);
      }
      return response;
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError') {
        setError(err);
        setData(null);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [packageId]);

  const startPolling = useCallback((interval = 3000) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Initial fetch
    fetchStatus();
    
    // Start polling
    intervalRef.current = setInterval(() => {
      fetchStatus();
    }, interval);
  }, [fetchStatus]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (options.enabled !== false) {
      if (options.autoPoll) {
        startPolling(options.pollInterval || 3000);
      } else {
        fetchStatus();
      }
    }
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      stopPolling();
    };
  }, [packageId, options.enabled, options.autoPoll]);

  return {
    data,
    loading,
    error,
    refetch: fetchStatus,
    startPolling,
    stopPolling,
    isPolling: !!intervalRef.current,
  };
};

/**
 * Hook: Encrypt a package
 */
export const useEncryptPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const encryptPackage = useCallback(async (packageId) => {
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