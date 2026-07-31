/**
 * Media Service - Cloud Admin
 * Handles API communication for Media Library
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const MEDIA_URL = API_ENDPOINTS.QUESTION_BANK.MEDIA;

/**
 * Upload a media file
 * @param {File} file - File to upload
 * @param {string} altText - Alternative text
 * @returns {Promise<Object>} Upload response
 */
export const uploadMedia = async (file, altText = '') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }

    const response = await api.post(`${MEDIA_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all media with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.mimeType - Filter by MIME type
 * @param {string} params.uploadedBy - Filter by uploader
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Paginated media
 */
export const getMedia = async (params = {}) => {
  try {
    const response = await api.get(MEDIA_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get media by ID
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Media data
 */
export const getMediaById = async (id) => {
  try {
    const response = await api.get(`${MEDIA_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update media metadata
 * @param {string} id - Media ID
 * @param {Object} data - Update data
 * @param {string} data.altText - Alternative text
 * @param {string} data.status - Media status
 * @returns {Promise<Object>} Updated media
 */
export const updateMedia = async (id, data) => {
  try {
    const response = await api.put(`${MEDIA_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Replace media file
 * @param {string} id - Media ID
 * @param {File} file - New file
 * @returns {Promise<Object>} Updated media
 */
export const replaceMedia = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.put(`${MEDIA_URL}/${id}/replace`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Archive a media file (soft delete)
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Archived media
 */
export const archiveMedia = async (id) => {
  try {
    const response = await api.delete(`${MEDIA_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Restore an archived media file
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Restored media
 */
export const restoreMedia = async (id) => {
  try {
    const response = await api.post(`${MEDIA_URL}/${id}/restore`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate a media file
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Activated media
 */
export const activateMedia = async (id) => {
  try {
    const response = await api.patch(`${MEDIA_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate a media file
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Deactivated media
 */
export const deactivateMedia = async (id) => {
  try {
    const response = await api.patch(`${MEDIA_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get media statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Media statistics
 */
export const getMediaStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${MEDIA_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get active media (for dropdowns)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Active media
 */
export const getActiveMedia = async (params = {}) => {
  try {
    const response = await api.get(`${MEDIA_URL}/active`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  uploadMedia,
  getMedia,
  getMediaById,
  updateMedia,
  replaceMedia,
  archiveMedia,
  restoreMedia,
  activateMedia,
  deactivateMedia,
  getMediaStatistics,
  getActiveMedia,
};