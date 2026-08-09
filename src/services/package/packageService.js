/**
 * Centre Package Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend package endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/packages
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/packages`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Package API Error:', error);
  
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
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = data?.message || 'Conflict: The package cannot be generated.';
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
 * Get packages with pagination
 * GET /api/v1/packages
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.instanceId - Filter by instance
 * @param {string} params.centreId - Filter by centre
 * @param {string} params.examId - Filter by exam
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Paginated packages
 */
export const getPackages = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { 
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        status: params.status,
        instanceId: params.instanceId,
        centreId: params.centreId,
        examId: params.examId,
        includeDeleted: params.includeDeleted
      }
    });
    
    // Backend returns: { success, message, data: [...], meta: { total, page, pages, limit } }
    return {
      data: response.data.data || [],
      total: response.data.meta?.total || 0,
      page: response.data.meta?.page || 1,
      pages: response.data.meta?.pages || 0,
      limit: response.data.meta?.limit || 20
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get package by ID
 * GET /api/v1/packages/:id
 * 
 * @param {string} packageId - Package ID
 * @param {boolean} includeDeleted - Include deleted
 * @returns {Promise<Object>} Package details
 */
export const getPackageById = async (packageId, includeDeleted = false) => {
  try {
    const response = await api.get(`${BASE_URL}/${packageId}`, {
      params: { includeDeleted }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get packages by centre
 * GET /api/v1/packages/centre/:centreId
 * 
 * @param {string} centreId - Centre ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {number} params.limit - Limit results
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Array>} Packages
 */
export const getPackagesByCentre = async (centreId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/centre/${centreId}`, { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate package for a specific centre
 * POST /api/v1/packages/generate
 * 
 * @param {Object} data - Generation data
 * @param {string} data.instanceId - Instance ID
 * @param {string} data.centreId - Centre ID
 * @param {string} data.notes - Optional notes
 * @returns {Promise<Object>} Generated package
 */
export const generatePackage = async (data) => {
  try {
    const response = await api.post(`${BASE_URL}/generate`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate packages for all centres
 * POST /api/v1/packages/generate-all
 * 
 * @param {Object} data - Generation data
 * @param {string} data.instanceId - Instance ID
 * @param {Array} data.centreIds - Optional specific centres
 * @param {string} data.notes - Optional notes
 * @returns {Promise<Object>} Generation results
 */
export const generateAllPackages = async (data) => {
  try {
    const response = await api.post(`${BASE_URL}/generate-all`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update package status
 * PUT /api/v1/packages/:id/status
 * 
 * @param {string} packageId - Package ID
 * @param {string} status - New status
 * @param {string} reason - Optional reason
 * @returns {Promise<Object>} Updated package
 */
export const updatePackageStatus = async (packageId, status, reason = '') => {
  try {
    const response = await api.put(`${BASE_URL}/${packageId}/status`, { status, reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getPackages,
  getPackageById,
  getPackagesByCentre,
  generatePackage,
  generateAllPackages,
  updatePackageStatus,
};