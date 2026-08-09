/* eslint-disable no-unused-vars */
/**
 * Package Download Service
 * Handles API communication for Package Downloads
 * 
 * Service responsibilities:
 * - Only Axios requests
 * - No UI logic
 * - No state management
 * 
 * Location: src/services/package/packageDownloadService.js
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

// ============================================================
// BASE URLS
// ============================================================

const DOWNLOAD_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/package-downloads`;
const PACKAGE_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/packages`;

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get downloads with pagination and filtering
 * GET /api/v1/package-downloads
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by download status
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.packageId - Filter by package ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.startDate - Start date for filtering
 * @param {string} params.endDate - End date for filtering
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Paginated downloads
 */
export const getDownloads = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}`, {
      params: sanitizeParams({
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        status: params.status,
        centreId: params.centreId,
        packageId: params.packageId,
        examId: params.examId,
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
 * Get download by ID
 * GET /api/v1/package-downloads/:id
 * 
 * @param {string} id - Download ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Download details
 */
export const getDownload = async (id, signal = null) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/${id}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get download statistics
 * GET /api/v1/package-downloads/statistics
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Download statistics
 */
export const getDownloadStatistics = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/statistics`, {
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
    console.warn('Failed to fetch download statistics:', error.message);
    return {
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      uniqueCentres: 0,
      latestDownload: null
    };
  }
};

/**
 * Get download timeline
 * GET /api/v1/package-downloads/:id/timeline
 * 
 * @param {string} id - Download ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Array>} Download timeline
 */
export const getDownloadTimeline = async (id, signal = null) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/${id}/timeline`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get downloads for a specific package
 * GET /api/v1/package-downloads/package/:packageId
 * 
 * @param {string} packageId - Package ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Array>} Package downloads
 */
export const getPackageDownloads = async (packageId, signal = null) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/package/${packageId}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Export download report
 * GET /api/v1/package-downloads/export
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.format - Export format (pdf, csv)
 * @param {string} params.startDate - Start date
 * @param {string} params.endDate - End date
 * @returns {Promise<Blob>} Report file
 */
export const exportDownloadReport = async (params = {}) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/export`, {
      params: sanitizeParams({
        centreId: params.centreId,
        format: params.format || 'csv',
        startDate: params.startDate,
        endDate: params.endDate
      }),
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Verify download integrity
 * GET /api/v1/package-downloads/:id/verify
 * 
 * @param {string} id - Download ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Verification result
 */
export const verifyDownload = async (id, signal = null) => {
  try {
    const response = await api.get(`${DOWNLOAD_BASE}/${id}/verify`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Retry failed download
 * POST /api/v1/package-downloads/:id/retry
 * 
 * @param {string} id - Download ID
 * @returns {Promise<Object>} Retry result
 */
export const retryDownload = async (id) => {
  try {
    const response = await api.post(`${DOWNLOAD_BASE}/${id}/retry`);
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
  getDownloads,
  getDownload,
  getDownloadStatistics,
  getDownloadTimeline,
  getPackageDownloads,
  exportDownloadReport,
  verifyDownload,
  retryDownload
};