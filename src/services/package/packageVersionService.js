/* eslint-disable no-unused-vars */
/**
 * Package Version Service
 * Handles API communication for Package Version Management
 * 
 * Service responsibilities:
 * - Only Axios requests
 * - No UI logic
 * - No state management
 * 
 * Location: src/services/package/packageVersionService.js
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

// ============================================================
// BASE URLS
// ============================================================

const VERSION_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/package-versions`;
const PACKAGE_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/packages`;

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get versions with pagination and filtering
 * GET /api/v1/package-versions
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.packageId - Filter by package ID
 * @param {string} params.versionNumber - Filter by version number
 * @param {string} params.startDate - Start date for filtering
 * @param {string} params.endDate - End date for filtering
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Paginated versions
 */
export const getVersions = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${VERSION_BASE}`, {
      params: sanitizeParams({
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        status: params.status,
        centreId: params.centreId,
        examId: params.examId,
        packageId: params.packageId,
        versionNumber: params.versionNumber,
        startDate: params.startDate,
        endDate: params.endDate,
        sort: params.sort || '-createdAt'
      }),
      signal
    });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get version by ID
 * GET /api/v1/package-versions/:id
 * 
 * @param {string} id - Version ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Version details
 */
export const getVersion = async (id, signal = null) => {
  try {
    const response = await api.get(`${VERSION_BASE}/${id}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Compare two versions
 * GET /api/v1/package-versions/compare
 * 
 * @param {string} versionAId - First version ID
 * @param {string} versionBId - Second version ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Comparison result
 */
export const compareVersions = async (versionAId, versionBId, signal = null) => {
  try {
    const response = await api.get(`${VERSION_BASE}/compare`, {
      params: {
        versionA: versionAId,
        versionB: versionBId
      },
      signal
    });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Regenerate a package version
 * POST /api/v1/package-versions/regenerate
 * 
 * @param {string} versionId - Version ID to regenerate
 * @param {Object} options - Regeneration options
 * @param {string} options.reason - Reason for regeneration
 * @param {string} options.notes - Additional notes
 * @returns {Promise<Object>} Regeneration result
 */
export const regeneratePackage = async (versionId, options = {}) => {
  try {
    const response = await api.post(`${VERSION_BASE}/regenerate`, {
      versionId,
      reason: options.reason || '',
      notes: options.notes || ''
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Archive a version
 * POST /api/v1/package-versions/:id/archive
 * 
 * @param {string} id - Version ID
 * @param {string} reason - Archive reason
 * @returns {Promise<Object>} Archived version
 */
export const archiveVersion = async (id, reason = '') => {
  try {
    const response = await api.post(`${VERSION_BASE}/${id}/archive`, { reason });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get version timeline
 * GET /api/v1/package-versions/:id/timeline
 * 
 * @param {string} id - Version ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Array>} Version timeline
 */
export const getVersionTimeline = async (id, signal = null) => {
  try {
    const response = await api.get(`${VERSION_BASE}/${id}/timeline`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get version statistics
 * GET /api/v1/package-versions/statistics
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Version statistics
 */
export const getVersionStatistics = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${VERSION_BASE}/statistics`, {
      params: sanitizeParams({
        centreId: params.centreId,
        examId: params.examId
      }),
      signal
    });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    // Return default stats on error
    console.warn('Failed to fetch version statistics:', error.message);
    return {
      total: 0,
      latest: 0,
      archived: 0,
      regenerated: 0,
      active: 0,
      revoked: 0
    };
  }
};

/**
 * Export version report
 * GET /api/v1/package-versions/export
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.format - Export format (pdf, csv)
 * @returns {Promise<Blob>} Report file
 */
export const exportVersionReport = async (params = {}) => {
  try {
    const response = await api.get(`${VERSION_BASE}/export`, {
      params: sanitizeParams({
        centreId: params.centreId,
        format: params.format || 'csv'
      }),
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Restore a version
 * POST /api/v1/package-versions/:id/restore
 * 
 * @param {string} id - Version ID
 * @param {string} reason - Restore reason
 * @returns {Promise<Object>} Restored version
 */
export const restoreVersion = async (id, reason = '') => {
  try {
    const response = await api.post(`${VERSION_BASE}/${id}/restore`, { reason });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Sanitize parameters - remove undefined, null, empty string values
 */
const sanitizeParams = (params) => {
  if (!params) return {};
  
  const sanitized = {};
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && 
        value !== null && 
        value !== '' && 
        !(Array.isArray(value) && value.length === 0)) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

/**
 * Handle API errors
 */
const handleApiError = (error) => {
  console.error('Package Version API Error:', error);
  
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
        message = data?.message || 'A conflict occurred.';
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
// DEFAULT EXPORT
// ============================================================

export default {
  getVersions,
  getVersion,
  compareVersions,
  regeneratePackage,
  archiveVersion,
  getVersionTimeline,
  getVersionStatistics,
  exportVersionReport,
  restoreVersion
};