
/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Download Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Download operations
 * 
 * Location: src/hooks/useDownload.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as downloadService from '../services/package/downloadService.js';

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
 * Hook: Get download history for a package
 */
export const useDownloadHistory = (packageId, params = {}, options = {}) => {
  return useFetchData(
    downloadService.getDownloadHistory,
    { packageId, ...params },
    { ...options, enabled: !!packageId && options.enabled !== false }
  );
};

/**
 * Hook: Get download by ID
 */
export const useDownload = (downloadId, options = {}) => {
  return useFetchData(
    downloadService.getDownload,
    downloadId,
    { ...options, enabled: !!downloadId && options.enabled !== false }
  );
};

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook: Initiate a download
 */
export const useInitiateDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const initiateDownload = useCallback(async (packageId, centreId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    
    try {
      const response = await downloadService.initiateDownload(packageId, centreId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { initiateDownload, loading, error, result, progress };
};

/**
 * Hook: Complete a download
 */
export const useCompleteDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const completeDownload = useCallback(async (downloadId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await downloadService.completeDownload(downloadId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { completeDownload, loading, error, result };
};

/**
 * Hook: Generate download URL
 */
export const useGenerateDownloadUrl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generateDownloadUrl = useCallback(async (packageId, downloadId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await downloadService.generateDownloadUrl(packageId, downloadId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateDownloadUrl, loading, error, result };
};

/**
 * Hook: Stream download with progress
 */
export const useStreamDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const streamDownload = useCallback(async (packageId, token, fileName) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const blob = await downloadService.streamDownload(packageId, token);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `package-${packageId}.cbtx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadUrl(url);
      setProgress(100);
      return blob;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { streamDownload, loading, error, progress, downloadUrl };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  useDownloadHistory,
  useDownload,
  useInitiateDownload,
  useCompleteDownload,
  useGenerateDownloadUrl,
  useStreamDownload,
};