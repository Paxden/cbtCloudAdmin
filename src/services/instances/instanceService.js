/**
 * Examination Instance Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/exam-instances
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/exam-instances`;

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
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Exam Instance API Error:', error);
  
  if (error.response) {
    const { status, data } = error.response;
    let message = 'An unexpected error occurred. Please try again.';
    
    switch (status) {
      case 400:
        message = data?.message || 'Invalid request parameters.';
        break;
      case 401:
        message = 'Your session has expired. Please log in again.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested instance was not found.';
        break;
      case 409:
        message = data?.message || 'Conflict: The instance cannot be modified.';
        break;
      case 429:
        message = 'Too many requests. Please wait and try again.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = data?.message || message;
    }
    
    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.data = data;
    formattedError.validationErrors = data?.validationErrors || [];
    formattedError.validationWarnings = data?.validationWarnings || [];
    throw formattedError;
  }
  
  if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  }
  
  throw error;
};

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get list of examination instances with pagination and filtering
 * GET /api/v1/exam-instances
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status (comma separated)
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.sort - Sort field
 * @param {number} params.sortOrder - Sort order (1: asc, -1: desc)
 * @returns {Promise<Object>} Paginated instances
 */
export const getInstances = async (params = {}) => {
  try {
    const validParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search,
      status: params.status,
      examId: params.examId,
      sort: params.sort,
      sortOrder: params.sortOrder,
    };
    
    const response = await api.get(BASE_URL, {
      params: sanitizeParams(validParams)
    });
    
    // Backend returns { success: true, message: string, data: T }
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get instance statistics
 * GET /api/v1/exam-instances/statistics
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.examId - Filter by exam ID
 * @returns {Promise<Object>} Instance statistics
 */
export const getInstanceStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/statistics`, {
      params: sanitizeParams(params)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get instance by ID
 * GET /api/v1/exam-instances/:id
 * 
 * @param {string} instanceId - Instance ID
 * @returns {Promise<Object>} Instance details
 */
export const getInstanceById = async (instanceId) => {
  try {
    const response = await api.get(`${BASE_URL}/${instanceId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new examination instance
 * POST /api/v1/exam-instances
 * 
 * @param {Object} data - Instance data
 * @param {string} data.examId - Examination ID
 * @param {string} data.notes - Optional notes
 * @returns {Promise<Object>} Created instance
 */
export const createInstance = async (data) => {
  try {
    const response = await api.post(BASE_URL, {
      examId: data.examId,
      notes: data.notes || '',
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lock an examination instance
 * POST /api/v1/exam-instances/:id/lock
 * 
 * @param {string} instanceId - Instance ID
 * @returns {Promise<Object>} Locked instance
 */
export const lockInstance = async (instanceId) => {
  try {
    const response = await api.post(`${BASE_URL}/${instanceId}/lock`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Archive an examination instance
 * POST /api/v1/exam-instances/:id/archive
 * 
 * @param {string} instanceId - Instance ID
 * @param {string} reason - Archive reason
 * @returns {Promise<Object>} Archived instance
 */
export const archiveInstance = async (instanceId, reason = '') => {
  try {
    const response = await api.post(`${BASE_URL}/${instanceId}/archive`, {
      reason,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getInstances,
  getInstanceStatistics,
  getInstanceById,
  createInstance,
  lockInstance,
  archiveInstance,
};