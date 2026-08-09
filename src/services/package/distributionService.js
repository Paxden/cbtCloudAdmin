/**
 * Package Distribution Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend distribution endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/package-distributions
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/package-distributions`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Distribution API Error:', error);
  
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
        message = data?.message || 'Conflict: The distribution cannot be created.';
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
 * Create a distribution for a package
 * POST /api/v1/package-distributions
 * 
 * @param {Object} data - Distribution data
 * @param {string} data.packageId - Package ID
 * @param {string} data.centreId - Centre ID
 * @param {number} data.expiryDays - Days until expiry
 * @returns {Promise<Object>} Created distribution
 */
export const createDistribution = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get distributions for a centre
 * GET /api/v1/package-distributions/centre/:centreId
 * 
 * @param {string} centreId - Centre ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {number} params.limit - Limit results
 * @returns {Promise<Array>} Distributions
 */
export const getCentreDistributions = async (centreId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/centre/${centreId}`, { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get distribution by ID
 * GET /api/v1/package-distributions/:id
 * 
 * @param {string} distributionId - Distribution ID
 * @returns {Promise<Object>} Distribution
 */
export const getDistribution = async (distributionId) => {
  try {
    const response = await api.get(`${BASE_URL}/${distributionId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Authorize download for a centre
 * POST /api/v1/package-distributions/authorize
 * 
 * @param {Object} data - Authorization data
 * @param {string} data.packageId - Package ID
 * @param {string} data.centreId - Centre ID
 * @returns {Promise<Object>} Authorization result
 */
export const authorizeDownload = async (data) => {
  try {
    const response = await api.post(`${BASE_URL}/authorize`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get all distributions with filters
 * GET /api/v1/package-distributions
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {number} params.limit - Limit results
 * @param {number} params.page - Page number
 * @returns {Promise<Object>} Distributions
 */
export const getAllDistributions = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { params });
    
    // ✅ Fix: Handle the response structure correctly
    // The backend returns { success: true, message: "...", data: [...] }
    // So we need to return the data array with pagination info
    const dataArray = response.data.data || [];
    
    // Return in a consistent format that the hook expects
    return {
      data: dataArray,
      total: dataArray.length,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: Math.ceil(dataArray.length / (params.limit || 20))
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Revoke a distribution
 * POST /api/v1/package-distributions/:id/revoke
 * 
 * @param {string} distributionId - Distribution ID
 * @param {string} reason - Revocation reason
 * @returns {Promise<Object>} Revoked distribution
 */
export const revokeDistribution = async (distributionId, reason = '') => {
  try {
    const response = await api.post(`${BASE_URL}/${distributionId}/revoke`, { reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  createDistribution,
  getCentreDistributions,
  getDistribution,
  authorizeDownload,
  getAllDistributions,
  revokeDistribution,
};