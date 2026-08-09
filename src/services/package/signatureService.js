/**
 * Package Signature Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend signature endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/package-signatures
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/package-signatures`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Signature API Error:', error);
  
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
        message = data?.message || 'Conflict: The package cannot be signed.';
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
 * Get signature information for a package
 * GET /api/v1/package-signatures/:packageId
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Signature information
 */
export const getSignature = async (packageId) => {
  try {
    const response = await api.get(`${BASE_URL}/${packageId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Sign a package
 * POST /api/v1/package-signatures/:packageId/sign
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Signature result
 */
export const signPackage = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/sign`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Verify a package signature
 * POST /api/v1/package-signatures/:packageId/verify
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Verification result
 */
export const verifySignature = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/verify`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Revoke a package signature
 * POST /api/v1/package-signatures/:packageId/revoke
 * 
 * @param {string} packageId - Package ID
 * @param {string} reason - Revocation reason
 * @returns {Promise<Object>} Revoked signature
 */
export const revokeSignature = async (packageId, reason = '') => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/revoke`, { reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Regenerate a package signature
 * POST /api/v1/package-signatures/:packageId/regenerate
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} New signature
 */
export const regenerateSignature = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/regenerate`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getSignature,
  signPackage,
  verifySignature,
  revokeSignature,
  regenerateSignature,
};