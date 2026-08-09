/* eslint-disable no-unused-vars */
/**
 * Package Distribution Service
 * Handles API communication for Package Distribution
 * 
 * Service responsibilities:
 * - Only Axios requests
 * - No UI logic
 * - No state management
 * 
 * Location: src/services/package/packageDistributionService.js
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

// ============================================================
// BASE URLS
// ============================================================

const DISTRIBUTION_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/package-distribution`;
const PACKAGE_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/packages`;

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get distributions with pagination and filtering
 * GET /api/v1/package-distribution
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by distribution status
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.instanceId - Filter by instance ID
 * @param {string} params.startDate - Start date for filtering
 * @param {string} params.endDate - End date for filtering
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Paginated distributions
 */
export const getDistributions = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${DISTRIBUTION_BASE}`, {
      params: sanitizeParams({
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        status: params.status,
        centreId: params.centreId,
        examId: params.examId,
        instanceId: params.instanceId,
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
 * Get distribution by ID
 * GET /api/v1/package-distribution/:id
 * 
 * @param {string} id - Distribution ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Distribution details
 */
export const getDistribution = async (id, signal = null) => {
  try {
    const response = await api.get(`${DISTRIBUTION_BASE}/${id}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get validated packages ready for distribution
 * GET /api/v1/package-distribution/validated-packages
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Array>} Validated packages
 */
export const getValidatedPackages = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${DISTRIBUTION_BASE}/validated-packages`, {
      params: sanitizeParams({
        centreId: params.centreId,
        limit: params.limit || 100
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
 * Release a package for distribution
 * POST /api/v1/package-distribution/release
 * 
 * @param {string} packageId - Package ID to release
 * @param {Object} options - Release options
 * @param {string} options.centreId - Centre ID to release to
 * @param {string} options.notes - Release notes
 * @param {number} options.expiryDays - Expiry days for download
 * @returns {Promise<Object>} Release result
 */
export const releasePackage = async (packageId, options = {}) => {
  try {
    const response = await api.post(`${DISTRIBUTION_BASE}/release`, {
      packageId,
      centreId: options.centreId,
      notes: options.notes || '',
      expiryDays: options.expiryDays || 7
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Release multiple packages for distribution
 * POST /api/v1/package-distribution/release-batch
 * 
 * @param {Array} packageIds - Array of package IDs
 * @param {Object} options - Release options
 * @param {string} options.centreId - Centre ID to release to
 * @param {string} options.notes - Release notes
 * @param {number} options.expiryDays - Expiry days for download
 * @returns {Promise<Object>} Batch release results
 */
export const releaseBatchPackages = async (packageIds, options = {}) => {
  try {
    const response = await api.post(`${DISTRIBUTION_BASE}/release-batch`, {
      packageIds,
      centreId: options.centreId,
      notes: options.notes || '',
      expiryDays: options.expiryDays || 7
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Revoke a package distribution
 * POST /api/v1/package-distribution/:id/revoke
 * 
 * @param {string} id - Distribution ID
 * @param {string} reason - Revocation reason
 * @returns {Promise<Object>} Revoked distribution
 */
export const revokeDistribution = async (id, reason = '') => {
  try {
    const response = await api.post(`${DISTRIBUTION_BASE}/${id}/revoke`, { reason });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get centre delivery status
 * GET /api/v1/package-distribution/centre/:centreId/status
 * 
 * @param {string} centreId - Centre ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Centre delivery status
 */
export const getCentreDeliveryStatus = async (centreId, signal = null) => {
  try {
    const response = await api.get(`${DISTRIBUTION_BASE}/centre/${centreId}/status`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get distribution statistics
 * GET /api/v1/package-distribution/statistics
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.instanceId - Filter by instance ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Distribution statistics
 */
export const getDistributionStatistics = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${DISTRIBUTION_BASE}/statistics`, {
      params: sanitizeParams({
        centreId: params.centreId,
        examId: params.examId,
        instanceId: params.instanceId
      }),
      signal
    });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    // Return default stats on error
    console.warn('Failed to fetch distribution statistics:', error.message);
    return {
      total: 0,
      validated: 0,
      ready: 0,
      released: 0,
      delivered: 0,
      pendingDelivery: 0,
      failedDelivery: 0
    };
  }
};

/**
 * Export distribution report
 * GET /api/v1/package-distribution/export
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.format - Export format (pdf, csv)
 * @returns {Promise<Blob>} Report file
 */
export const exportDistributionReport = async (params = {}) => {
  try {
    const response = await api.get(`${DISTRIBUTION_BASE}/export`, {
      params: sanitizeParams({
        centreId: params.centreId,
        format: params.format || 'pdf'
      }),
      responseType: 'blob'
    });
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
  console.error('Package Distribution API Error:', error);
  
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
  getDistributions,
  getDistribution,
  getValidatedPackages,
  releasePackage,
  releaseBatchPackages,
  revokeDistribution,
  getCentreDeliveryStatus,
  getDistributionStatistics,
  exportDistributionReport
};