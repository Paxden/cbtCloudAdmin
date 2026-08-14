/**
 * Package Download Service — Frontend
 * Matches backend: /api/v1/packages/*/
//  download, /api/v1/package-downloads/*
 

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const PACKAGE_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/packages`;
const DOWNLOAD_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/package-downloads`;

const sanitizeParams = (params) => {
  if (!params) return {};
  const sanitized = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

const handleApiError = (error) => {
  console.error('Package Download API Error:', error);

  if (error.response) {
    const { status, data } = error.response;
    let message = 'An unexpected error occurred. Please try again.';

    switch (status) {
      case 400:
        message = data?.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Your session has expired. Please log in again.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = data?.message || 'Conflict: this download cannot be modified.';
        break;
      case 410:
        message = 'This download link has expired.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later or contact support.';
        break;
      default:
        message = data?.message || message;
    }

    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.data = data;
    throw formattedError;
  }

  if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  }

  throw error;
};

// ============================================================
// INITIATE / STREAM (the two-step real download flow)
// ============================================================

/**
 * Step 1: Create the tracking record and get a download token.
 * GET /api/v1/packages/:packageId/download
 * `centreId` is only honoured by the backend for SUPER_ADMIN — safe to
 * omit for other roles, since the backend falls back to req.user.centreId.
 */
export const initiateDownload = async (packageId, centreId) => {
  try {
    const response = await api.get(`${PACKAGE_BASE}/${packageId}/download`, {
      params: sanitizeParams({ centreId }),
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Step 2: Actually pull the file bytes using the token from step 1.
 * GET /api/v1/packages/download/:packageId?token=...
 * Supports a progress callback via axios' onDownloadProgress.
 */
export const streamDownload = async (packageId, token, onProgress) => {
  try {
    const response = await api.get(`${PACKAGE_BASE}/download/${packageId}`, {
      params: { token },
      responseType: 'blob',
      onDownloadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
    return response.data;
  } catch (error) {
    // Blob error responses arrive as a Blob, not JSON — unwrap them first
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        error.response.data = parsed;
      } catch {
        // leave as-is if it wasn't JSON
      }
    }
    throw handleApiError(error);
  }
};

// ============================================================
// LIFECYCLE
// ============================================================

export const completeDownload = async (downloadId) => {
  try {
    const response = await api.post(`${DOWNLOAD_BASE}/${downloadId}/complete`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const failDownload = async (downloadId, reason = '') => {
  try {
    const response = await api.post(`${DOWNLOAD_BASE}/${downloadId}/fail`, { reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const retryDownload = async (downloadId) => {
  try {
    const response = await api.post(`${DOWNLOAD_BASE}/${downloadId}/retry`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const verifyDownload = async (downloadId) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/${downloadId}/verify`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// READS
// ============================================================

export const getDownloads = async (params = {}) => {
  try {
    const response = await api.get(DOWNLOAD_BASE, {
      params: sanitizeParams({
        page: params.page || 1,
        limit: params.limit || 20,
        status: params.status,
        centreId: params.centreId,
        packageId: params.packageId,
        search: params.search,
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    });
    return response.data.data; // { data, meta }
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDownload = async (downloadId) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/${downloadId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDownloadHistory = async (packageId, limit = 50) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/${packageId}/history`, {
      params: sanitizeParams({ limit }),
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCentreDownloads = async (centreId, params = {}) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/centre/${centreId}`, {
      params: sanitizeParams({ status: params.status, limit: params.limit || 100 }),
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDownloadStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/statistics`, {
      params: sanitizeParams({
        centreId: params.centreId,
        packageId: params.packageId,
        fromDate: params.fromDate,
        toDate: params.toDate,
      }),
    });
    return response.data.data;
  } catch (error) {
    // Statistics are supplementary — fail soft so a broken stats call
    // doesn't take down the whole page.
    console.warn('Failed to fetch download statistics:', error.message);
    return {
      total: 0,
      byStatus: { started: 0, inProgress: 0, completed: 0, failed: 0, cancelled: 0 },
      sizeStats: { totalSize: 0, avgSize: 0, avgDuration: 0, avgSpeed: 0 },
      successRate: 0,
      uniqueCentres: 0,
      latestDownload: null,
    };
  }
};

export default {
  initiateDownload,
  streamDownload,
  completeDownload,
  failDownload,
  retryDownload,
  verifyDownload,
  getDownloads,
  getDownload,
  getDownloadHistory,
  getCentreDownloads,
  getDownloadStatistics,
};