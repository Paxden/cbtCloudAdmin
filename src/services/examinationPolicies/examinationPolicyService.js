/**
 * Examination Policy Service - Cloud Admin
 * Handles API communication for Examination Policy & Security Rules
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';

/**
 * Get policies for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @returns {Promise<Object>} Policy data
 */
export const getPolicies = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/policy`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create policies for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Created policies
 */
export const createPolicies = async (examinationId, data) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/policy`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update policies for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Policy data
 * @returns {Promise<Object>} Updated policies
 */
export const updatePolicies = async (examinationId, data) => {
  try {
    const response = await api.put(
      `${BASE_URL}/${examinationId}/policy`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Validate policies
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Validation result
 */
export const validatePolicies = async (examinationId) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/policy/validate`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate policies
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Activated policies
 */
export const activatePolicies = async (examinationId) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/policy/activate`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Archive policies
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Archived policies
 */
export const archivePolicies = async (examinationId) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/policy/archive`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get policy categories
 * @returns {Promise<Object>} Policy categories
 */
export const getPolicyCategories = async () => {
  try {
    const response = await api.get('/api/v1/policy/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getPolicies,
  createPolicies,
  updatePolicies,
  validatePolicies,
  activatePolicies,
  archivePolicies,
  getPolicyCategories,
};