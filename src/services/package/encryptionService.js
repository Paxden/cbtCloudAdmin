/**
 * Package Encryption Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend encryption endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/package-encryption
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/package-encryption`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Encryption API Error:', error);
  
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
        message = data?.message || 'Conflict: The package cannot be encrypted.';
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
 * Get encryption status for a package
 * GET /api/v1/package-encryption/:packageId/status
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Encryption status
 */
export const getEncryptionStatus = async (packageId) => {
  try {
    const response = await api.get(`${BASE_URL}/${packageId}/status`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Encrypt a package
 * POST /api/v1/package-encryption/:packageId/encrypt
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Encryption result
 */
export const encryptPackage = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/encrypt`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Re-encrypt a package (key rotation)
 * POST /api/v1/package-encryption/:packageId/re-encrypt
 * 
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Re-encryption result
 */
export const reEncryptPackage = async (packageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/re-encrypt`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Decrypt a package asset (for verification)
 * POST /api/v1/package-encryption/:packageId/decrypt
 * 
 * @param {string} packageId - Package ID
 * @param {string} assetType - Asset type to decrypt
 * @returns {Promise<Object>} Decrypted asset
 */
export const decryptPackageAsset = async (packageId, assetType) => {
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/decrypt`, {
      assetType,
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
  getEncryptionStatus,
  encryptPackage,
  reEncryptPackage,
  decryptPackageAsset,
};