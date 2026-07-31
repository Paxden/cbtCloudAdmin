/**
 * Difficulty Service - Cloud Admin
 * Handles API communication for Difficulty Levels
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const BASE_URL = API_ENDPOINTS.QUESTION_BANK.DIFFICULTIES;

/**
 * Get all difficulty levels with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Paginated difficulty levels
 */
export const getDifficulties = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get difficulty level by ID
 * @param {string} id - Difficulty ID
 * @returns {Promise<Object>} Difficulty data
 */
export const getDifficulty = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new difficulty level
 * @param {Object} data - Difficulty data
 * @param {string} data.name - Difficulty name
 * @param {string} data.description - Difficulty description
 * @param {number} data.levelOrder - Level order
 * @param {string} data.status - Difficulty status
 * @returns {Promise<Object>} Created difficulty
 */
export const createDifficulty = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a difficulty level
 * @param {string} id - Difficulty ID
 * @param {Object} data - Update data
 * @param {string} data.name - Difficulty name
 * @param {string} data.description - Difficulty description
 * @param {number} data.levelOrder - Level order
 * @param {string} data.status - Difficulty status
 * @returns {Promise<Object>} Updated difficulty
 */
export const updateDifficulty = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete (soft delete) a difficulty level
 * @param {string} id - Difficulty ID
 * @returns {Promise<Object>} Deleted difficulty
 */
export const deleteDifficulty = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate a difficulty level
 * @param {string} id - Difficulty ID
 * @returns {Promise<Object>} Activated difficulty
 */
export const activateDifficulty = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate a difficulty level
 * @param {string} id - Difficulty ID
 * @returns {Promise<Object>} Deactivated difficulty
 */
export const deactivateDifficulty = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get difficulty statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Difficulty statistics
 */
export const getDifficultyStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get active difficulty levels (for dropdowns)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Active difficulty levels
 */
export const getActiveDifficulties = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/active`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getDifficulties,
  getDifficulty,
  createDifficulty,
  updateDifficulty,
  deleteDifficulty,
  activateDifficulty,
  deactivateDifficulty,
  getDifficultyStatistics,
  getActiveDifficulties,
};