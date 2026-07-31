/**
 * Topic Service - Cloud Admin
 * Handles API communication for Topics
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const BASE_URL = API_ENDPOINTS.QUESTION_BANK.TOPICS;
const SUBJECT_URL = API_ENDPOINTS.QUESTION_BANK.SUBJECTS;

/**
 * Get all topics with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.subjectId - Filter by subject
 * @param {string} params.status - Filter by status
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Paginated topics
 */
export const getTopics = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get topic by ID
 * @param {string} id - Topic ID
 * @returns {Promise<Object>} Topic data
 */
export const getTopic = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new topic
 * @param {Object} data - Topic data
 * @param {string} data.name - Topic name
 * @param {string} data.subjectId - Subject ID
 * @param {string} data.description - Topic description
 * @param {string} data.status - Topic status
 * @returns {Promise<Object>} Created topic
 */
export const createTopic = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a topic
 * @param {string} id - Topic ID
 * @param {Object} data - Update data
 * @param {string} data.name - Topic name
 * @param {string} data.subjectId - Subject ID
 * @param {string} data.description - Topic description
 * @param {string} data.status - Topic status
 * @returns {Promise<Object>} Updated topic
 */
export const updateTopic = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete (soft delete) a topic
 * @param {string} id - Topic ID
 * @returns {Promise<Object>} Deleted topic
 */
export const deleteTopic = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate a topic
 * @param {string} id - Topic ID
 * @returns {Promise<Object>} Activated topic
 */
export const activateTopic = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate a topic
 * @param {string} id - Topic ID
 * @returns {Promise<Object>} Deactivated topic
 */
export const deactivateTopic = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get topic statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Topic statistics
 */
export const getTopicStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get active subjects (for dropdown)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Active subjects
 */
export const getSubjects = async (params = {}) => {
  try {
    const response = await api.get(`${SUBJECT_URL}/active`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get topics by subject (for dropdowns)
 * @param {string} subjectId - Subject ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Topics by subject
 */
export const getTopicsBySubject = async (subjectId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/by-subject/${subjectId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};