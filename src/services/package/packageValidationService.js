
/**
 * Package Validation Service
 * Handles API communication for Package Validation
 * 
 * Service responsibilities:
 * - Only Axios requests
 * - No UI logic
 * - No state management
 * 
 * Location: src/services/package/packageValidationService.js
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

// ============================================================
// BASE URLS
// ============================================================

const VALIDATION_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/package-validation`;
const PACKAGE_BASE = `${API_ENDPOINTS.BASE || '/api/v1'}/packages`;

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get validations with pagination and filtering
 * GET /api/v1/package-validation
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.instanceId - Filter by instance ID
 * @param {string} params.startDate - Start date for filtering
 * @param {string} params.endDate - End date for filtering
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Paginated validations
 */
export const getValidations = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${VALIDATION_BASE}`, {
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
 * Get validation by ID
 * GET /api/v1/package-validation/:id
 * 
 * @param {string} id - Validation ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Validation details
 */
export const getValidation = async (id, signal = null) => {
  try {
    const response = await api.get(`${VALIDATION_BASE}/${id}`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Run validation for a package
 * POST /api/v1/package-validation/run
 * 
 * @param {string} packageId - Package ID to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.fullValidation - Run full validation
 * @returns {Promise<Object>} Validation result
 */
export const runValidation = async (packageId, options = {}) => {
  try {
    const response = await api.post(`${VALIDATION_BASE}/run`, {
      packageId,
      options: {
        fullValidation: options.fullValidation !== false,
        ...options
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Run validation for multiple packages
 * POST /api/v1/package-validation/run-batch
 * 
 * @param {Array} packageIds - Array of package IDs
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} Batch validation results
 */
export const runBatchValidation = async (packageIds, options = {}) => {
  try {
    const response = await api.post(`${VALIDATION_BASE}/run-batch`, {
      packageIds,
      options: {
        fullValidation: options.fullValidation !== false,
        ...options
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get validation checklist for a package
 * GET /api/v1/package-validation/:id/checklist
 * 
 * @param {string} id - Validation ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Validation checklist
 */
export const getValidationChecklist = async (id, signal = null) => {
  try {
    const response = await api.get(`${VALIDATION_BASE}/${id}/checklist`, { signal });
    return response.data;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }
    throw handleApiError(error);
  }
};

/**
 * Get validation statistics
 * GET /api/v1/package-validation/statistics
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.instanceId - Filter by instance ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Object>} Validation statistics
 */
export const getValidationStatistics = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${VALIDATION_BASE}/statistics`, {
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
    console.warn('Failed to fetch validation statistics:', error.message);
    return {
      total: 0,
      valid: 0,
      pending: 0,
      failed: 0,
      warning: 0,
      rejected: 0,
      readyForDistribution: 0
    };
  }
};

/**
 * Export validation report
 * GET /api/v1/package-validation/:id/export
 * 
 * @param {string} id - Validation ID
 * @param {string} format - Export format (pdf, csv)
 * @returns {Promise<Blob>} Report file
 */
export const exportValidationReport = async (id, format = 'pdf') => {
  try {
    const response = await api.get(`${VALIDATION_BASE}/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get packages ready for validation
 * GET /api/v1/package-validation/ready-packages
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {AbortSignal} signal - Abort signal
 * @returns {Promise<Array>} Ready packages
 */
export const getReadyPackages = async (params = {}, signal = null) => {
  try {
    const response = await api.get(`${PACKAGE_BASE}/ready-for-validation`, {
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
  console.error('Package Validation API Error:', error);
  
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
  getValidations,
  getValidation,
  runValidation,
  runBatchValidation,
  getValidationChecklist,
  getValidationStatistics,
  exportValidationReport,
  getReadyPackages
};