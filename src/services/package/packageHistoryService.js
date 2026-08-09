
/**
 * Package History Service
 * Handles API communication for Package History & Audit Trail
 * 
 * Service responsibilities:
 * - Only Axios requests
 * - No UI logic
 * - No state management
 * 
 * Location: src/services/package/packageHistoryService.js
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

// ============================================================
// BASE URLS
// ============================================================

const HISTORY_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/package-history`;

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get history with pagination and filtering
 * GET /api/v1/package-history
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.activityType - Filter by activity type
 * @param {string} params.severity - Filter by severity
 * @param {string} params.userId - Filter by user ID
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.packageId - Filter by package ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.instanceId - Filter by instance ID
 * @param {string} params.startDate - Start date for filtering
 * @param {string} params.endDate - End date for filtering
 * @param {string} params.status - Filter by status
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Paginated history
 */
export const getHistory = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${HISTORY_BASE}`, {
      params: sanitizeParams({
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        activityType: params.activityType,
        severity: params.severity,
        userId: params.userId,
        centreId: params.centreId,
        packageId: params.packageId,
        examId: params.examId,
        instanceId: params.instanceId,
        startDate: params.startDate,
        endDate: params.endDate,
        status: params.status,
        sort: params.sort || '-timestamp'
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
 * Get history details by ID
 * GET /api/v1/package-history/:id
 * 
 * @param {string} id - History entry ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} History details
 */
export const getHistoryDetails = async (id, signal = null) => {
  try {
    const response = await api.get(`${HISTORY_BASE}/${id}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get timeline for a specific package
 * GET /api/v1/package-history/timeline/:packageId
 * 
 * @param {string} packageId - Package ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Array>} Package timeline
 */
export const getTimeline = async (packageId, signal = null) => {
  try {
    const response = await api.get(`${HISTORY_BASE}/timeline/${packageId}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get package lifecycle
 * GET /api/v1/package-history/lifecycle/:packageId
 * 
 * @param {string} packageId - Package ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Package lifecycle
 */
export const getPackageLifecycle = async (packageId, signal = null) => {
  try {
    const response = await api.get(`${HISTORY_BASE}/lifecycle/${packageId}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get history statistics
 * GET /api/v1/package-history/statistics
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.startDate - Start date
 * @param {string} params.endDate - End date
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} History statistics
 */
export const getHistoryStatistics = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${HISTORY_BASE}/statistics`, {
      params: sanitizeParams({
        centreId: params.centreId,
        examId: params.examId,
        startDate: params.startDate,
        endDate: params.endDate
      }),
      signal
    });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    // Return default stats on error
    console.warn('Failed to fetch history statistics:', error.message);
    return {
      totalActivities: 0,
      packagesCreated: 0,
      packagesGenerated: 0,
      packagesDistributed: 0,
      packagesDownloaded: 0,
      failedActivities: 0,
      auditEvents: 0
    };
  }
};

/**
 * Export audit report
 * GET /api/v1/package-history/export
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.startDate - Start date
 * @param {string} params.endDate - End date
 * @param {string} params.format - Export format (pdf, csv)
 * @returns {Promise<Blob>} Report file
 */
export const exportAuditReport = async (params = {}) => {
  try {
    const response = await api.get(`${HISTORY_BASE}/export`, {
      params: sanitizeParams({
        centreId: params.centreId,
        startDate: params.startDate,
        endDate: params.endDate,
        format: params.format || 'pdf'
      }),
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Print audit report
 * GET /api/v1/package-history/print
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.startDate - Start date
 * @param {string} params.endDate - End date
 * @returns {Promise<Blob>} Print-ready report
 */
export const printAuditReport = async (params = {}) => {
  try {
    const response = await api.get(`${HISTORY_BASE}/print`, {
      params: sanitizeParams({
        centreId: params.centreId,
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
  console.error('Package History API Error:', error);
  
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
  getHistory,
  getHistoryDetails,
  getTimeline,
  getPackageLifecycle,
  getHistoryStatistics,
  exportAuditReport,
  printAuditReport
};