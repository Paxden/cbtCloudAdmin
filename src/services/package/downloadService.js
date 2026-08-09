/**
 * Package Download Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend download endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/package-downloads
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/package-downloads`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Download API Error:', error);
  
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
        message = 'You do not have permission to download this package.';
        break;
      case 404:
        message = 'The requested package was not found.';
        break;
      case 409:
        message = data?.message || 'Conflict: The package cannot be downloaded.';
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
 * Initiate a package download
 * POST /api/v1/package-downloads/initiate
 * 
 * @param {string} packageId - Package ID
 * @param {string} centreId - Centre ID
 * @returns {Promise<Object>} Download initiation result
 */
export const initiateDownload = async (packageId, centreId) => {
  try {
    const response = await api.post(`${BASE_URL}/initiate`, { packageId, centreId });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Complete a download
 * POST /api/v1/package-downloads/:id/complete
 * 
 * @param {string} downloadId - Download ID
 * @returns {Promise<Object>} Completion result
 */
export const completeDownload = async (downloadId) => {
  try {
    const response = await api.post(`${BASE_URL}/${downloadId}/complete`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fail a download
 * POST /api/v1/package-downloads/:id/fail
 * 
 * @param {string} downloadId - Download ID
 * @param {string} reason - Failure reason
 * @returns {Promise<Object>} Failed download
 */
export const failDownload = async (downloadId, reason = '') => {
  try {
    const response = await api.post(`${BASE_URL}/${downloadId}/fail`, { reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get download history for a package
 * GET /api/v1/package-downloads/history/:packageId
 * 
 * @param {string} packageId - Package ID
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Limit results
 * @returns {Promise<Array>} Download history
 */
export const getDownloadHistory = async (packageId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/history/${packageId}`, { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get download by ID
 * GET /api/v1/package-downloads/:id
 * 
 * @param {string} downloadId - Download ID
 * @returns {Promise<Object>} Download record
 */
export const getDownload = async (downloadId) => {
  try {
    const response = await api.get(`${BASE_URL}/${downloadId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate a signed download URL
 * POST /api/v1/package-downloads/url
 * 
 * @param {string} packageId - Package ID
 * @param {string} downloadId - Download ID
 * @returns {Promise<Object>} Signed URL
 */
export const generateDownloadUrl = async (packageId, downloadId) => {
  try {
    const response = await api.post(`${BASE_URL}/url`, { packageId, downloadId });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Download package file directly (stream)
 * GET /api/v1/package-downloads/stream/:packageId
 * 
 * @param {string} packageId - Package ID
 * @param {string} token - Download token
 * @returns {Promise<Blob>} Package file blob
 */
export const streamDownload = async (packageId, token) => {
  try {
    const response = await api.get(`${BASE_URL}/stream/${packageId}`, {
      params: { token },
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
  initiateDownload,
  completeDownload,
  failDownload,
  getDownloadHistory,
  getDownload,
  generateDownloadUrl,
  streamDownload,
};