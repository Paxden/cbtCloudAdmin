/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Version Hooks
 * Location: src/hooks/useVersion.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as versionService from '../services/package/packageVersionService';

/**
 * Generic hook for fetching data.
 * fetchFn must accept a SINGLE params object — callers that wrap a
 * service function with a different (positional) signature need to
 * adapt it first, not pass the service function directly.
 */
const useFetchData = (fetchFn, params = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // ✅ Object-aware validity check: every value inside params must be
  // present. params is always a plain object here (e.g. { packageId, versionId }),
  // so checking `params !== 'null'` alone (object vs string) never catches
  // a null/undefined field inside it — check the values themselves.
  const isValidParams =
    params &&
    typeof params === 'object' &&
    Object.values(params).every(
      (v) => v !== null && v !== undefined && v !== 'null' && v !== ''
    );

  const fetchData = useCallback(async () => {
    if (!isValidParams) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, JSON.stringify(params)]);

  useEffect(() => {
    isMountedRef.current = true;

    if (options.enabled !== false && isValidParams) {
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, options.enabled]);

  return { data, loading, error, refetch: fetchData };
};

// ============================================================
// QUERY HOOKS
// ============================================================

const getStringId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return id !== 'null' ? id : null;
  if (typeof id === 'object' && id._id) return id._id;
  if (typeof id === 'object' && id.id) return id.id;
  return null; // don't stringify unknown objects into "[object Object]"
};

/**
 * Hook: Get versions for a package
 * GET /api/v1/package-versions/:packageId
 */
export const usePackageVersions = (packageId, params = {}, options = {}) => {
  const pkgId = getStringId(packageId);
  const isValidPackageId = !!pkgId;

  // Adapter: unpacks the merged { packageId, ...queryParams } object
  // back into the service's real (packageId, params) signature.
  const fetchVersions = useCallback(
    ({ packageId: id, ...queryParams }) => versionService.getPackageVersions(id, queryParams),
    [],
  );

  return useFetchData(
    fetchVersions,
    { packageId: pkgId, status: params.status, limit: params.limit, page: params.page },
    { ...options, enabled: isValidPackageId && options.enabled !== false },
  );
};

/**
 * Hook: Get version by ID
 * GET /api/v1/package-versions/:packageId/:versionId
 */
export const useVersion = (packageId, versionId, options = {}) => {
  const pkgId = getStringId(packageId);
  const verId = getStringId(versionId);

  const isValidIds = !!pkgId && !!verId;

  const fetchVersion = useCallback(
    ({ packageId: pId, versionId: vId }) => versionService.getVersion(pId, vId),
    [],
  );

  return useFetchData(
    fetchVersion,
    { packageId: pkgId, versionId: verId },
    { ...options, enabled: isValidIds && options.enabled !== false },
  );
};

// ============================================================
// MUTATION HOOKS
// ============================================================

export const useCreateVersion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const createVersion = useCallback(async (packageId, data) => {
    if (!packageId || packageId === 'null') {
      throw new Error('Invalid package ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await versionService.createVersion(packageId, data);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createVersion, loading, error, result };
};

export const useActivateVersion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const activateVersion = useCallback(async (versionId) => {
    if (!versionId || versionId === 'null') {
      throw new Error('Invalid version ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await versionService.activateVersion(versionId);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { activateVersion, loading, error, result };
};

export const useArchiveVersion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const archiveVersion = useCallback(async (versionId, reason = '') => {
    if (!versionId || versionId === 'null') {
      throw new Error('Invalid version ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await versionService.archiveVersion(versionId, reason);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { archiveVersion, loading, error, result };
};

export const useRevokeVersion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const revokeVersion = useCallback(async (versionId, reason = '') => {
    if (!versionId || versionId === 'null') {
      throw new Error('Invalid version ID');
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await versionService.revokeVersion(versionId, reason);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { revokeVersion, loading, error, result };
};

export const useCompareVersions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const compareVersions = useCallback(async (versionId1, versionId2) => {
    if (!versionId1 || versionId1 === 'null' || !versionId2 || versionId2 === 'null') {
      throw new Error('Invalid version IDs');
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await versionService.compareVersions({ versionId1, versionId2 });
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { compareVersions, loading, error, result };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  usePackageVersions,
  useVersion,
  useCreateVersion,
  useActivateVersion,
  useArchiveVersion,
  useRevokeVersion,
  useCompareVersions,
};