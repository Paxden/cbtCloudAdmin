/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Download Hooks
 * Location: src/hooks/useDownload.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as downloadService from '../services/package/packageDownloadService.js';

/**
 * Generic hook for fetching data
 */
const useFetchData = (fetchFn, params, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  const isValidParams = params !== null && params !== undefined && params !== 'null';

  const fetchData = useCallback(async () => {
    if (!isValidParams) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(params);
      if (isMountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, options.enabled]);

  return { data, loading, error, refetch: fetchData };
};

// ============================================================
// QUERY HOOKS
// ============================================================

/** Paginated, filterable download list — GET /package-downloads */
export const useDownloads = (params = {}, options = {}) => {
  return useFetchData(downloadService.getDownloads, params, options);
};

/** Single download — GET /package-downloads/:downloadId */
export const useDownload = (downloadId, options = {}) => {
  const isValid = downloadId && downloadId !== 'null';
  return useFetchData(downloadService.getDownload, downloadId, {
    ...options,
    enabled: isValid && options.enabled !== false,
  });
};

/** Download history for one package — GET /package-downloads/:packageId/history */
export const useDownloadHistory = (packageId, limit = 50, options = {}) => {
  const isValid = packageId && packageId !== 'null';
  return useFetchData(
    (id) => downloadService.getDownloadHistory(id, limit),
    packageId,
    { ...options, enabled: isValid && options.enabled !== false },
  );
};

/** Downloads for a centre — GET /package-downloads/centre/:centreId */
export const useCentreDownloads = (centreId, params = {}, options = {}) => {
  const isValid = centreId && centreId !== 'null';
  return useFetchData(
    (id) => downloadService.getCentreDownloads(id, params),
    centreId,
    { ...options, enabled: isValid && options.enabled !== false },
  );
};

/** Statistics — GET /package-downloads/statistics */
export const useDownloadStatistics = (params = {}, options = {}) => {
  return useFetchData(downloadService.getDownloadStatistics, params, options);
};

// ============================================================
// MUTATION HOOKS
// ============================================================

const useMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const response = await mutationFn(...args);
        setResult(response);
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn],
  );

  return { mutate, loading, error, result };
};

/** Step 1: create the download record + get a token */
export const useInitiateDownload = () => {
  const { mutate, loading, error, result } = useMutation((packageId, centreId) => {
    if (!packageId || packageId === 'null') {
      return Promise.reject(new Error('Invalid package ID'));
    }
    return downloadService.initiateDownload(packageId, centreId);
  });
  return { initiateDownload: mutate, loading, error, result };
};

/** Step 2: stream the actual file, with live progress */
export const useStreamDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const streamDownload = useCallback(async (packageId, token, fileName) => {
    if (!packageId || packageId === 'null' || !token || token === 'null') {
      throw new Error('Invalid package or token');
    }
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const blob = await downloadService.streamDownload(packageId, token, setProgress);

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

  return { streamDownload, loading, error, progress };
};

export const useCompleteDownload = () => {
  const { mutate, loading, error, result } = useMutation((downloadId) => {
    if (!downloadId || downloadId === 'null') {
      return Promise.reject(new Error('Invalid download ID'));
    }
    return downloadService.completeDownload(downloadId);
  });
  return { completeDownload: mutate, loading, error, result };
};

export const useFailDownload = () => {
  const { mutate, loading, error, result } = useMutation((downloadId, reason) => {
    if (!downloadId || downloadId === 'null') {
      return Promise.reject(new Error('Invalid download ID'));
    }
    return downloadService.failDownload(downloadId, reason);
  });
  return { failDownload: mutate, loading, error, result };
};

export const useVerifyDownload = () => {
  const { mutate, loading, error, result } = useMutation((downloadId) => {
    if (!downloadId || downloadId === 'null') {
      return Promise.reject(new Error('Invalid download ID'));
    }
    return downloadService.verifyDownload(downloadId);
  });
  return { verifyDownload: mutate, loading, error, result };
};

export const useRetryDownload = () => {
  const { mutate, loading, error, result } = useMutation((downloadId) => {
    if (!downloadId || downloadId === 'null') {
      return Promise.reject(new Error('Invalid download ID'));
    }
    return downloadService.retryDownload(downloadId);
  });
  return { retryDownload: mutate, loading, error, result };
};

export default {
  useDownloads,
  useDownload,
  useDownloadHistory,
  useCentreDownloads,
  useDownloadStatistics,
  useInitiateDownload,
  useStreamDownload,
  useCompleteDownload,
  useFailDownload,
  useVerifyDownload,
  useRetryDownload,
};