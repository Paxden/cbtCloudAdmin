/**
 * Candidate Service - Cloud Admin
 * Handles API communication for Candidate Management
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';

/**
 * Get candidates for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.department - Filter by department
 * @param {string} params.organization - Filter by organization
 * @param {string} params.gender - Filter by gender
 * @param {string} params.sort - Sort field and direction
 * @param {boolean} params.includeDeleted - Include deleted candidates
 * @returns {Promise<Object>} Paginated candidates
 */
export const getCandidates = async (examinationId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/${examinationId}/candidates`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get candidate by ID
 * @param {string} candidateId - Candidate ID
 * @param {Object} params - Query parameters
 * @param {boolean} params.includeDeleted - Include deleted candidate
 * @returns {Promise<Object>} Candidate details
 */
export const getCandidate = async (candidateId, params = {}) => {
  try {
    const response = await api.get(`/api/v1/candidates/${candidateId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update candidate
 * @param {string} candidateId - Candidate ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated candidate
 */
export const updateCandidate = async (candidateId, data) => {
  try {
    const response = await api.put(`/api/v1/candidates/${candidateId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate candidate
 * @param {string} candidateId - Candidate ID
 * @returns {Promise<Object>} Activated candidate
 */
export const activateCandidate = async (candidateId) => {
  try {
    const response = await api.patch(`/api/v1/candidates/${candidateId}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate candidate
 * @param {string} candidateId - Candidate ID
 * @returns {Promise<Object>} Deactivated candidate
 */
export const deactivateCandidate = async (candidateId) => {
  try {
    const response = await api.patch(`/api/v1/candidates/${candidateId}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete candidate (soft delete)
 * @param {string} candidateId - Candidate ID
 * @returns {Promise<Object>} Deleted candidate
 */
export const deleteCandidate = async (candidateId) => {
  try {
    const response = await api.patch(`/api/v1/candidates/${candidateId}/delete`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Restore candidate
 * @param {string} candidateId - Candidate ID
 * @returns {Promise<Object>} Restored candidate
 */
export const restoreCandidate = async (candidateId) => {
  try {
    const response = await api.patch(`/api/v1/candidates/${candidateId}/restore`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk activate candidates
 * @param {string} examinationId - Examination ID
 * @param {Array} candidateIds - Array of candidate IDs
 * @returns {Promise<Object>} Bulk result
 */
export const bulkActivate = async (examinationId, candidateIds) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/candidates/bulk-status`,
      { candidateIds, status: 'ACTIVE' }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk deactivate candidates
 * @param {string} examinationId - Examination ID
 * @param {Array} candidateIds - Array of candidate IDs
 * @returns {Promise<Object>} Bulk result
 */
export const bulkDeactivate = async (examinationId, candidateIds) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/candidates/bulk-status`,
      { candidateIds, status: 'INACTIVE' }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get candidate statistics
 * @param {string} examinationId - Examination ID
 * @param {boolean} includeDeleted - Include deleted candidates
 * @returns {Promise<Object>} Candidate statistics
 */
export const getCandidateStats = async (examinationId, includeDeleted = false) => {
  try {
    const response = await api.get(`${BASE_URL}/${examinationId}/candidates/stats`, {
      params: { includeDeleted }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getCandidates,
  getCandidate,
  updateCandidate,
  activateCandidate,
  deactivateCandidate,
  deleteCandidate,
  restoreCandidate,
  bulkActivate,
  bulkDeactivate,
  getCandidateStats,
};