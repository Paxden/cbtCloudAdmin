/**
 * Question Type Service - Cloud Admin
 * Handles API communication for Question Types
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const BASE_URL = API_ENDPOINTS.QUESTION_BANK.QUESTION_TYPES;

/**
 * Get all question types with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Paginated question types
 */
export const getQuestionTypes = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question type by ID
 * @param {string} id - Question Type ID
 * @returns {Promise<Object>} Question type data
 */
export const getQuestionType = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Seed default question types
 * @returns {Promise<Object>} Seeded question types
 */
export const seedQuestionTypes = async () => {
  try {
    const response = await api.post(`${BASE_URL}/seed`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new question type
 * @param {Object} data - Question type data
 * @param {string} data.name - Question type name
 * @param {string} data.code - Question type code
 * @param {string} data.description - Question type description
 * @param {string} data.answerFormat - Answer format
 * @param {string} data.status - Question type status
 * @param {boolean} data.isSystem - System type flag
 * @returns {Promise<Object>} Created question type
 */
export const createQuestionType = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a question type
 * @param {string} id - Question Type ID
 * @param {Object} data - Update data
 * @param {string} data.name - Question type name
 * @param {string} data.description - Question type description
 * @param {string} data.status - Question type status
 * @returns {Promise<Object>} Updated question type
 */
export const updateQuestionType = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete (soft delete) a question type
 * @param {string} id - Question Type ID
 * @returns {Promise<Object>} Deleted question type
 */
export const deleteQuestionType = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate a question type
 * @param {string} id - Question Type ID
 * @returns {Promise<Object>} Activated question type
 */
export const activateQuestionType = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate a question type
 * @param {string} id - Question Type ID
 * @returns {Promise<Object>} Deactivated question type
 */
export const deactivateQuestionType = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question type statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Question type statistics
 */
export const getQuestionTypeStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get active question types (for dropdowns)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Active question types
 */
export const getActiveQuestionTypes = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/active`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getQuestionTypes,
  getQuestionType,
  seedQuestionTypes,
  createQuestionType,
  updateQuestionType,
  deleteQuestionType,
  activateQuestionType,
  deactivateQuestionType,
  getQuestionTypeStatistics,
  getActiveQuestionTypes,
};