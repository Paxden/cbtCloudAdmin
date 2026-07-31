/**
 * Media Upload Service
 * Handles media uploads for the editor
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const MEDIA_URL = API_ENDPOINTS.QUESTION_BANK.MEDIA;

/**
 * Upload an image for the editor
 * @param {File} file - Image file
 * @returns {Promise<Object>} Upload response
 */
export const uploadEditorImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'editor');

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
 * Delete an image from the editor
 * @param {string} mediaId - Media ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteEditorImage = async (mediaId) => {
  try {
    const response = await api.delete(`${MEDIA_URL}/${mediaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get editor images
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Images list
 */
export const getEditorImages = async (params = {}) => {
  try {
    const response = await api.get(MEDIA_URL, {
      params: {
        type: 'editor',
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Export named exports
export default {
  uploadEditorImage,
  deleteEditorImage,
  getEditorImages,
};