/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * Package Builder Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Build operations
 * 
 * Location: src/hooks/usePackageBuilder.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as packageBuilderService from '../services/package/packageBuilderService.js';
import { FileStatus } from '../types/packageBuilder.types.js';

/**
 * Hook for building a package
 */
export const useBuildPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const buildPackage = useCallback(async (packageId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await packageBuilderService.buildPackage(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { buildPackage, loading, error, result };
};

/**
 * Hook for rebuilding a package
 */
export const useRebuildPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const rebuildPackage = useCallback(async (packageId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await packageBuilderService.rebuildPackage(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { rebuildPackage, loading, error, result };
};

/**
 * Hook for getting package file record
 */
export const usePackageFile = (packageId, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
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
      const response = await packageBuilderService.getPackageFile(packageId);
      if (isMountedRef.current) {
        setData(response);
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
  }, [packageId]);

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

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for getting build status with polling
 */
export const useBuildStatus = (packageId, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const pollIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchStatus = useCallback(async () => {
    if (!packageId) return;
    
    try {
      const response = await packageBuilderService.getBuildStatus(packageId);
      if (isMountedRef.current) {
        setData(response);
        setError(null);
      }
      return response;
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
      }
      throw err;
    }
  }, [packageId]);

  const startPolling = useCallback((interval = 3000) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    setIsPolling(true);
    
    // Initial fetch
    fetchStatus();
    
    // Start polling
    pollIntervalRef.current = setInterval(() => {
      fetchStatus();
    }, interval);
  }, [fetchStatus]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (options.enabled !== false && options.autoPoll) {
      startPolling(options.pollInterval || 3000);
    } else if (options.enabled !== false) {
      fetchStatus();
    }
    
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [packageId, options.enabled, options.autoPoll, options.pollInterval]);

  return {
    data,
    loading,
    error,
    isPolling,
    refetch: fetchStatus,
    startPolling,
    stopPolling,
  };
};

/**
 * Hook for downloading a package
 */
export const useDownloadPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const downloadPackage = useCallback(async (packageId, fileName) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const blob = await packageBuilderService.downloadPackage(packageId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `package-${packageId}.cbtx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setProgress(100);
      return blob;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { downloadPackage, loading, error, progress };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  useBuildPackage,
  useRebuildPackage,
  usePackageFile,
  useBuildStatus,
  useDownloadPackage,
};