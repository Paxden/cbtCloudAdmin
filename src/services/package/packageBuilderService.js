/**
 * Package Builder Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to build CBTX packages
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/package-builder
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/package-builder`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Package Builder API Error:', error);
  
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
        message = data?.message || 'Conflict: The package cannot be built.';
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
 * Build a CBTX package
 * POST /api/v1/package-builder/build
 * 
 * @param {string} packageId - Package ID to build
 * @returns {Promise<Object>} Build result
 */
export const buildPackage = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/build`, { packageId });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Rebuild a CBTX package
 * POST /api/v1/package-builder/rebuild
 * 
 * @param {string} packageId - Package ID to rebuild
 * @returns {Promise<Object>} Rebuild result
 */
export const rebuildPackage = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/rebuild`, { packageId });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get package file record
 * GET /api/v1/package-builder/files/:packageId
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} File record
 */
export const getPackageFile = async (packageId) => {
  try {
    const response = await api.get(`${BASE_URL}/files/${packageId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get package build status
 * GET /api/v1/package-builder/status/:packageId
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Build status
 */
export const getBuildStatus = async (packageId) => {
  try {
    const response = await api.get(`${BASE_URL}/status/${packageId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Download built package
 * GET /api/v1/package-builder/download/:packageId
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Blob>} Package file blob
 */
export const downloadPackage = async (packageId) => {
  try {
    const response = await api.get(`${BASE_URL}/download/${packageId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  buildPackage,
  rebuildPackage,
  getPackageFile,
  getBuildStatus,
  downloadPackage,
};