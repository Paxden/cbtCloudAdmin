/**
 * Examination Instruction Service - Cloud Admin
 * Handles API communication for Examination Instructions & Resources
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';

/**
 * Get instructions for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {string} params.type - Filter by instruction type
 * @returns {Promise<Object>} Instructions data
 */
export const getInstructions = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/instructions`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create or update instructions
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Instructions data
 * @returns {Promise<Object>} Saved instructions
 */
export const saveInstructions = async (examinationId, data) => {
  try {
    // Check if instructions exist
    const existing = await getInstructions(examinationId);
    if (existing && existing.success && existing.data) {
      // Update existing
      const response = await api.put(
        `${BASE_URL}/${examinationId}/instructions`,
        data
      );
      return response.data;
    } else {
      // Create new
      const response = await api.post(
        `${BASE_URL}/${examinationId}/instructions`,
        data
      );
      return response.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Upload a resource
 * @param {string} examinationId - Examination ID
 * @param {FormData} formData - Resource file data
 * @param {Function} onProgress - Upload progress callback
 * @returns {Promise<Object>} Uploaded resource
 */
export const uploadResource = async (examinationId, formData, onProgress) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/resources`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a resource
 * @param {string} examinationId - Examination ID
 * @param {string} resourceId - Resource ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteResource = async (examinationId, resourceId) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/${examinationId}/resources/${resourceId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Preview instructions as candidate would see them
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Preview data
 */
export const previewInstructions = async (examinationId) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/instructions/preview`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Validate instructions
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Validation result
 */
export const validateInstructions = async (examinationId) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/instructions/validate`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Publish instructions
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Publish data
 * @param {string} data.comments - Publication comments
 * @returns {Promise<Object>} Published instructions
 */
export const publishInstructions = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/instructions/publish`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getInstructions,
  saveInstructions,
  uploadResource,
  deleteResource,
  previewInstructions,
  validateInstructions,
  publishInstructions,
};