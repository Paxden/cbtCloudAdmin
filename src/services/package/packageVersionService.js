/**
 * Package Version Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend version endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/package-versions
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/package-versions`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Version API Error:', error);
  
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
        message = data?.message || 'Conflict: The version cannot be modified.';
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
 * ✅ Guard against null/undefined/'null' IDs before they reach the network.
 * Turns a silent "/package-versions/null/null" request into a clear,
 * catchable JS error at the call site.
 */
const assertValidId = (id, label) => {
  if (!id || id === 'null' || id === 'undefined') {
    throw new Error(`${label} is required and must be a valid ID`);
  }
};

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get versions for a package
 * GET /api/v1/package-versions/:packageId
 * 
 * @param {string} packageId - Package ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {number} params.limit - Limit results
 * @param {number} params.page - Page number
 * @returns {Promise<Object>} Paginated versions
 */
export const getPackageVersions = async (packageId, params = {}) => {
  assertValidId(packageId, 'packageId');
  try {
    const response = await api.get(`${BASE_URL}/${packageId}`, {
      params: sanitizeParams({
        status: params.status,
        limit: params.limit || 100,
        page: params.page || 1,
      })
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get version by ID
 * GET /api/v1/package-versions/:packageId/:versionId
 * 
 * @param {string} packageId - Package ID
 * @param {string} versionId - Version ID
 * @returns {Promise<Object>} Version details
 */
export const getVersion = async (packageId, versionId) => {
  assertValidId(packageId, 'packageId');
  assertValidId(versionId, 'versionId');
  try {
    const response = await api.get(`${BASE_URL}/${packageId}/${versionId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Compare two versions
 * POST /api/v1/package-versions/compare
 * 
 * @param {Object} data - Comparison data
 * @param {string} data.versionId1 - First version ID
 * @param {string} data.versionId2 - Second version ID
 * @returns {Promise<Object>} Comparison result
 */
export const compareVersions = async (data) => {
  assertValidId(data?.versionId1, 'versionId1');
  assertValidId(data?.versionId2, 'versionId2');
  try {
    const response = await api.post(`${BASE_URL}/compare`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new version
 * POST /api/v1/package-versions/:packageId/create
 * 
 * @param {string} packageId - Package ID
 * @param {Object} data - Version data
 * @param {string} data.changeReason - Reason for new version
 * @param {string} data.changeDescription - Detailed description
 * @param {Array} data.changes - List of changes
 * @param {Object} data.snapshot - Package snapshot data
 * @returns {Promise<Object>} Created version
 */
export const createVersion = async (packageId, data) => {
  assertValidId(packageId, 'packageId');
  try {
    const response = await api.post(`${BASE_URL}/${packageId}/create`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Activate a version
 * POST /api/v1/package-versions/:versionId/activate
 * 
 * @param {string} versionId - Version ID
 * @returns {Promise<Object>} Activated version
 */
export const activateVersion = async (versionId) => {
  assertValidId(versionId, 'versionId');
  try {
    const response = await api.post(`${BASE_URL}/${versionId}/activate`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Archive a version
 * POST /api/v1/package-versions/:versionId/archive
 * 
 * @param {string} versionId - Version ID
 * @param {string} reason - Archive reason
 * @returns {Promise<Object>} Archived version
 */
export const archiveVersion = async (versionId, reason = '') => {
  assertValidId(versionId, 'versionId');
  try {
    const response = await api.post(`${BASE_URL}/${versionId}/archive`, { reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Revoke a version
 * POST /api/v1/package-versions/:versionId/revoke
 * 
 * @param {string} versionId - Version ID
 * @param {string} reason - Revocation reason
 * @returns {Promise<Object>} Revoked version
 */
export const revokeVersion = async (versionId, reason = '') => {
  assertValidId(versionId, 'versionId');
  try {
    const response = await api.post(`${BASE_URL}/${versionId}/revoke`, { reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getPackageVersions,
  getVersion,
  compareVersions,
  createVersion,
  activateVersion,
  archiveVersion,
  revokeVersion,
};