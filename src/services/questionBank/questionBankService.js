/**
 * Question Bank Service - Cloud Admin
 * Handles API communication for Question Bank management
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const QUESTIONS_URL = API_ENDPOINTS.QUESTION_BANK.QUESTIONS;

/**
 * Get all questions with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.categoryId - Filter by category
 * @param {string} params.subjectId - Filter by subject
 * @param {string} params.topicId - Filter by topic
 * @param {string} params.difficultyId - Filter by difficulty
 * @param {string} params.questionTypeId - Filter by question type
 * @param {string} params.status - Filter by status
 * @param {string} params.createdBy - Filter by author
 * @param {string} params.dateFrom - Filter by created date from
 * @param {string} params.dateTo - Filter by created date to
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @param {boolean} params.includeDeleted - Include deleted questions
 * @returns {Promise<Object>} Paginated questions
 */
export const getQuestions = async (params = {}) => {
  try {
    const response = await api.get(QUESTIONS_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question by ID
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Question data
 */
export const getQuestion = async (id) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a question
 * @param {string} id - Question ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated question
 */
export const updateQuestion = async (id, data) => {
  try {
    const response = await api.put(`${QUESTIONS_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Duplicate a question
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Duplicated question
 */
export const duplicateQuestion = async (id) => {
  try {
    const response = await api.post(`${QUESTIONS_URL}/${id}/duplicate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Archive a question (soft delete)
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Archived question
 */
export const archiveQuestion = async (id) => {
  try {
    const response = await api.delete(`${QUESTIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Restore an archived question
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Restored question
 */
export const restoreQuestion = async (id) => {
  try {
    const response = await api.post(`${QUESTIONS_URL}/${id}/restore`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a question permanently (admin only)
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Deleted question
 */
export const deleteQuestionPermanently = async (id) => {
  try {
    const response = await api.delete(`${QUESTIONS_URL}/${id}/permanent`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Question statistics
 */
export const getQuestionBankStats = async (params = {}) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getQuestions,
  getQuestion,
  updateQuestion,
  duplicateQuestion,
  archiveQuestion,
  restoreQuestion,
  deleteQuestionPermanently,
  getQuestionBankStats,
};