/**
 * Package Checksum Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend checksum endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/package-checksums
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/package-checksums`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Checksum API Error:', error);
  
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
        message = data?.message || 'Conflict: The checksum cannot be generated.';
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
 * Get checksum information for a package
 * GET /api/v1/package-checksums/:packageId
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Checksum information
 */
export const getChecksum = async (packageId) => {
  try {
    const response = await api.get(`${BASE_URL}/${packageId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate checksum for a package
 * POST /api/v1/package-checksums/:packageId/generate
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Checksum result
 */
export const generateChecksum = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/generate`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Verify package integrity
 * POST /api/v1/package-checksums/:packageId/verify
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Verification result
 */
export const verifyChecksum = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/verify`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get package fingerprint
 * GET /api/v1/package-checksums/:packageId/fingerprint
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Fingerprint information
 */
export const getFingerprint = async (packageId) => {
  try {
    const response = await api.get(`${BASE_URL}/${packageId}/fingerprint`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getChecksum,
  generateChecksum,
  verifyChecksum,
  getFingerprint,
};