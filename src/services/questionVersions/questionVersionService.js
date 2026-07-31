/**
 * Question Version Service - Cloud Admin
 * Handles API communication for Question Version History & Audit Timeline
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const QUESTIONS_URL = API_ENDPOINTS.QUESTION_BANK.QUESTIONS;

/**
 * Get all versions for a question
 * @param {string} questionId - Question ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @param {string} params.editor - Filter by editor
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Paginated versions
 */
export const getVersions = async (questionId, params = {}) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${questionId}/versions`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get a specific version by number
 * @param {string} questionId - Question ID
 * @param {number} versionNumber - Version number
 * @param {Object} options - Query options
 * @param {boolean} options.includeSnapshot - Include full snapshot
 * @returns {Promise<Object>} Version data
 */
export const getVersion = async (questionId, versionNumber, options = {}) => {
  try {
    const { includeSnapshot = true } = options;
    const response = await api.get(`${QUESTIONS_URL}/${questionId}/versions/${versionNumber}`, {
      params: { includeSnapshot },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Compare two versions
 * @param {string} questionId - Question ID
 * @param {number} versionA - First version number
 * @param {number} versionB - Second version number
 * @returns {Promise<Object>} Comparison result
 */
export const compareVersions = async (questionId, versionA, versionB) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${questionId}/versions/compare`, {
      params: { versionA, versionB },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get audit timeline for a question
 * @param {string} questionId - Question ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.action - Filter by action
 * @param {string} params.userId - Filter by user
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Audit timeline
 */
export const getAuditTimeline = async (questionId, params = {}) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${questionId}/audit`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get latest version for a question
 * @param {string} questionId - Question ID
 * @returns {Promise<Object>} Latest version
 */
export const getLatestVersion = async (questionId) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${questionId}/versions/latest`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get version statistics
 * @param {string} questionId - Question ID
 * @returns {Promise<Object>} Version statistics
 */
export const getVersionStatistics = async (questionId) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${questionId}/versions/statistics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getVersions,
  getVersion,
  compareVersions,
  getAuditTimeline,
  getLatestVersion,
  getVersionStatistics,
};