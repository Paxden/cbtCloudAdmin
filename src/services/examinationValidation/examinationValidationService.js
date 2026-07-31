/**
 * Examination Validation Service - Cloud Admin
 * Handles API communication for Examination Validation & Pre-Deployment Checks
 */

import api from "../../config/axios";

const BASE_URL = "/api/v1/examinations";
const VALIDATIONS_BASE = "/api/v1/validations";

// ============================================================
// VALIDATION OPERATIONS
// ============================================================

/**
 * Validate an examination
 * POST /api/v1/examinations/:examinationId/validate
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Validation data
 * @param {string} data.comments - Validation comments
 * @returns {Promise<Object>} Validation result
 */
export const runValidation = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/validate`,
      data,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get latest validation result for an examination
 * GET /api/v1/examinations/:examinationId/validation
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {boolean} params.currentOnly - Only return current validation
 * @param {boolean} params.includeChecks - Include individual check details
 * @returns {Promise<Object>} Latest validation
 */
export const getLatestValidation = async (examinationId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/${examinationId}/validation`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get validation history for an examination
 * GET /api/v1/examinations/:examinationId/validation/history
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status (PASSED, FAILED, WARNING, IN_PROGRESS)
 * @param {string} params.sort - Sort field and direction
 * @param {string} params.startDate - Start date filter
 * @param {string} params.endDate - End date filter
 * @param {string} params.validatedBy - Filter by validator ID
 * @returns {Promise<Object>} Paginated validation history
 */
export const getValidationHistory = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/validation/history`,
      { params },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Check if examination has passed validation
 * GET /api/v1/examinations/:examinationId/validation/passed
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Passed status
 */
export const hasPassedValidation = async (examinationId) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/validation/passed`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get validation by ID
 * GET /api/v1/validations/:validationId
 * @param {string} validationId - Validation ID
 * @returns {Promise<Object>} Validation record
 */
export const getValidationById = async (validationId) => {
  try {
    const response = await api.get(`${VALIDATIONS_BASE}/${validationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get validation statistics
 * GET /api/v1/validations/stats
 * @param {Object} params - Query parameters
 * @param {string} params.examinationId - Filter by examination
 * @param {string} params.status - Filter by status
 * @param {string} params.validatedBy - Filter by validator
 * @param {string} params.startDate - Start date filter
 * @param {string} params.endDate - End date filter
 * @returns {Promise<Object>} Validation statistics
 */
export const getValidationStats = async (params = {}) => {
  try {
    const response = await api.get(`${VALIDATIONS_BASE}/stats`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  runValidation,
  getLatestValidation,
  getValidationHistory,
  hasPassedValidation,
  getValidationById,
  getValidationStats,
};
