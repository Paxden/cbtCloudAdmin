/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Signature Hooks
 * 
 * Hook responsibilities:
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Signature operations
 * 
 * Location: src/hooks/useSignature.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as signatureService from '../services/package/signatureService.js';

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
 * Hook: Get signature information
 */
export const useSignature = (packageId, options = {}) => {
  // ✅ Validate packageId before enabling
  const isValidPackageId = packageId && packageId !== 'null' && packageId !== null && packageId !== undefined;
  
  return useFetchData(
    signatureService.getSignature,
    packageId,
    { ...options, enabled: isValidPackageId && options.enabled !== false }
  );
};

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook: Sign a package
 */
export const useSignPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const signPackage = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await signatureService.signPackage(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signPackage, loading, error, result };
};

/**
 * Hook: Verify a package signature
 */
export const useVerifySignature = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const verifySignature = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await signatureService.verifySignature(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { verifySignature, loading, error, result };
};

/**
 * Hook: Revoke a package signature
 */
export const useRevokeSignature = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const revokeSignature = useCallback(async (packageId, reason = '') => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await signatureService.revokeSignature(packageId, reason);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { revokeSignature, loading, error, result };
};

/**
 * Hook: Regenerate a package signature
 */
export const useRegenerateSignature = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const regenerateSignature = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await signatureService.regenerateSignature(packageId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { regenerateSignature, loading, error, result };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  useSignature,
  useSignPackage,
  useVerifySignature,
  useRevokeSignature,
  useRegenerateSignature,
};