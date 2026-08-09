
/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Package Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Package operations
 * 
 * Location: src/hooks/usePackage.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as packageService from '../services/package/packageService.js';

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
 * Hook: Get packages with pagination
 */
export const usePackages = (params = {}, options = {}) => {
  return useFetchData(
    packageService.getPackages,
    params,
    options
  );
};

/**
 * Hook: Get package by ID
 */
export const usePackageById = (packageId, options = {}) => {
  return useFetchData(
    packageService.getPackageById,
    packageId,
    { ...options, enabled: !!packageId && options.enabled !== false }
  );
};

/**
 * Hook: Get packages by centre
 */
export const usePackagesByCentre = (centreId, params = {}, options = {}) => {
  return useFetchData(
    packageService.getPackagesByCentre,
    { centreId, ...params },
    { ...options, enabled: !!centreId && options.enabled !== false }
  );
};

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook: Generate package for a specific centre
 */
export const useGeneratePackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generatePackage = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await packageService.generatePackage(data);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generatePackage, loading, error, result };
};

/**
 * Hook: Generate packages for all centres
 */
export const useGenerateAllPackages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generateAllPackages = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await packageService.generateAllPackages(data);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateAllPackages, loading, error, result };
};

/**
 * Hook: Update package status
 */
export const useUpdatePackageStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const updatePackageStatus = useCallback(async (packageId, status, reason = '') => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await packageService.updatePackageStatus(packageId, status, reason);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePackageStatus, loading, error, result };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  usePackages,
  usePackageById,
  usePackagesByCentre,
  useGeneratePackage,
  useGenerateAllPackages,
  useUpdatePackageStatus,
};