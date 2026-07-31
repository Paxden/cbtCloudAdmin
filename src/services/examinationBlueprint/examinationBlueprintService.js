/**
 * Examination Blueprint Service - Cloud Admin
 * Handles API communication for Examination Blueprint
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';

/**
 * Get blueprint for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @returns {Promise<Object>} Blueprint details
 */
export const getBlueprint = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/blueprint`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new blueprint
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Blueprint data
 * @param {string} data.name - Blueprint name
 * @param {string} data.description - Blueprint description
 * @param {number} data.duration - Duration in minutes
 * @param {number} data.passingScore - Passing score percentage
 * @param {Array} data.sections - Array of sections
 * @returns {Promise<Object>} Created blueprint
 */
export const createBlueprint = async (examinationId, data) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/blueprint`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing blueprint
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Blueprint data
 * @returns {Promise<Object>} Updated blueprint
 */
export const updateBlueprint = async (examinationId, data) => {
  try {
    const response = await api.put(
      `${BASE_URL}/${examinationId}/blueprint`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add a section to a blueprint
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Section data
 * @returns {Promise<Object>} Updated blueprint
 */
export const addSection = async (examinationId, data) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/blueprint/sections`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a section in a blueprint
 * @param {string} examinationId - Examination ID
 * @param {string} sectionId - Section ID
 * @param {Object} data - Section data
 * @returns {Promise<Object>} Updated blueprint
 */
export const updateSection = async (examinationId, sectionId, data) => {
  try {
    const response = await api.put(
      `${BASE_URL}/${examinationId}/blueprint/sections/${sectionId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a section from a blueprint
 * @param {string} examinationId - Examination ID
 * @param {string} sectionId - Section ID
 * @returns {Promise<Object>} Updated blueprint
 */
export const deleteSection = async (examinationId, sectionId) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/${examinationId}/blueprint/sections/${sectionId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Lock a blueprint
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Locked blueprint
 */
export const lockBlueprint = async (examinationId) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/blueprint/lock`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Unlock a blueprint
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Unlocked blueprint
 */
export const unlockBlueprint = async (examinationId) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/blueprint/unlock`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Archive a blueprint
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Archived blueprint
 */
export const archiveBlueprint = async (examinationId) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/blueprint/archive`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Validate a blueprint
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Validation result
 */
export const validateBlueprint = async (examinationId) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/blueprint/validate`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get subjects for dropdown
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Subjects list
 */
export const getSubjects = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/subjects', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get topics for dropdown
 * @param {string} subjectId - Subject ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Topics list
 */
export const getTopics = async (subjectId, params = {}) => {
  try {
    const response = await api.get(
      `/api/v1/subjects/${subjectId}/topics`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getBlueprint,
  createBlueprint,
  updateBlueprint,
  addSection,
  updateSection,
  deleteSection,
  lockBlueprint,
  unlockBlueprint,
  archiveBlueprint,
  validateBlueprint,
  getSubjects,
  getTopics,
};